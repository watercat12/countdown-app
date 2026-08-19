# Countdown

Ứng dụng đồng hồ đếm ngược tối giản cho macOS, xây bằng Tauri 2 + React + TypeScript. Khi hết giờ, ứng dụng hiện notification hệ thống và phát âm thanh cảnh báo.

## Cài đặt môi trường

Yêu cầu: [Rust](https://rustup.rs/), Node.js, và Xcode Command Line Tools (trên macOS).

## Chạy phát triển

```bash
npm install
npm run tauri dev
```

## Build & cài đặt từ terminal

```bash
# Build bundle .app
npm run tauri build

# Cài vào ~/Applications (xuất hiện trong Launchpad)
npm run install:app

# Cài vào /Applications (cần sudo)
npm run install:app -- --system
```

Bundle nằm tại `src-tauri/target/release/bundle/macos/Countdown.app`.

## Cách dùng

Nhập thời lượng dạng rút gọn rồi bấm **Đặt giờ**, ví dụ:

| Nhập | Tương đương |
|------|-------------|
| `30s` | 30 giây |
| `5m` | 5 phút |
| `2m30s` | 2 phút 30 giây |
| `1h20s` | 1 giờ 20 giây |
| `1h2m3s` | 1 giờ 2 phút 3 giây |

Sau đó bấm **Start** để đếm ngược. Khi hết giờ, ứng dụng hiện notification và phát âm thanh hệ thống.

## Gỡ lỗi Gatekeeper

Bản build chưa ký/notarization nên lần mở đầu tiên macOS có thể chặn. Mở bằng chuột phải vào app > **Open**, hoặc xoá quarantine attribute:

```bash
xattr -dr com.apple.quarantine ~/Applications/Countdown.app
```
