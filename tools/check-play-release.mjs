import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const read = (file) => fs.readFileSync(path.join(root, file));
const text = (file) => read(file).toString("utf8");

function png(file) {
  const buffer = read(file);
  check(buffer.subarray(1, 4).toString("ascii") === "PNG", `${file}: PNG 파일이 아닙니다.`);
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    bitDepth: buffer[24],
    colorType: buffer[25],
    bytes: buffer.length
  };
}

const config = JSON.parse(text("capacitor.config.json"));
const manifest = text("android/app/src/main/AndroidManifest.xml");
const variables = text("android/variables.gradle");
const strings = text("android/app/src/main/res/values/strings.xml");
const privacy = text("docs/privacy-policy.html");

check(config.appName === "마운드 심리전", "Capacitor 앱 이름이 다릅니다.");
check(/^([a-z][a-z0-9_]*\.)+[a-z][a-z0-9_]*$/.test(config.appId), "패키지 ID 형식이 올바르지 않습니다.");
check(strings.includes(`<string name="package_name">${config.appId}</string>`), "Android package_name과 Capacitor appId가 다릅니다.");
check(/targetSdkVersion\s*=\s*36/.test(variables), "targetSdkVersion이 36이 아닙니다.");
check(/android:allowBackup="false"/.test(manifest), "Android 백업이 비활성화되지 않았습니다.");
check(!manifest.includes("android.permission.INTERNET"), "인터넷 권한이 추가되었습니다. 데이터 보안 선언을 다시 검토하십시오.");
check(privacy.includes("개인정보를 수집하거나 외부 서버로 전송하지 않습니다"), "개인정보처리방침의 무수집 선언을 찾지 못했습니다.");

const icon = png("store-assets/google-play/icon-512.png");
check(icon.width === 512 && icon.height === 512, "스토어 아이콘은 512×512여야 합니다.");
check(icon.bitDepth === 8 && icon.colorType === 6, "스토어 아이콘은 32비트 RGBA PNG여야 합니다.");
check(icon.bytes <= 1024 * 1024, "스토어 아이콘은 1MB 이하여야 합니다.");

const feature = png("store-assets/google-play/feature-graphic-1024x500.png");
check(feature.width === 1024 && feature.height === 500, "기능 그래픽은 1024×500이어야 합니다.");
check(feature.bitDepth === 8 && feature.colorType === 2, "기능 그래픽은 알파 없는 24비트 RGB PNG여야 합니다.");

const screenshotDir = path.join(root, "store-assets/google-play");
const screenshots = fs.readdirSync(screenshotDir).filter((name) => /^\d{2}-.+-1080x1920\.png$/.test(name));
check(screenshots.length >= 3, "1080×1920 게임 스크린샷이 최소 3장 필요합니다.");
for (const name of screenshots) {
  const shot = png(path.join("store-assets/google-play", name));
  check(shot.width === 1080 && shot.height === 1920, `${name}: 1080×1920이 아닙니다.`);
  check(shot.bitDepth === 8 && shot.colorType === 2, `${name}: 알파 없는 RGB PNG가 아닙니다.`);
}

if (failures.length) {
  console.error(`Google Play 출시 검사 실패 (${failures.length})`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Google Play 출시 기술 검사 통과: ${screenshots.length} screenshots, API 36, no sensitive permissions.`);
