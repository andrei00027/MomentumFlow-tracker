# Настройка iCloud синхронизации

## Важная информация

Для **полноценной** работы синхронизации с iCloud Drive требуется собрать приложение через **EAS Build**, а не через Expo Go.

## Почему не работает в Expo Go?

Expo Go - это sandbox приложение, которое не может использовать некоторые нативные возможности iOS, включая:
- iCloud Containers
- iCloud Key-Value Storage
- Custom App Groups
- Full File System Access

## Решение 1: Использовать EAS Build (Рекомендуется)

### Шаг 1: Установите EAS CLI
```bash
npm install -g eas-cli
```

### Шаг 2: Войдите в Expo аккаунт
```bash
eas login
```

### Шаг 3: Настройте проект
```bash
eas build:configure
```

### Шаг 4: Создайте build для iOS
```bash
# Development build для тестирования на устройстве
eas build --profile development --platform ios

# Production build для App Store
eas build --profile production --platform ios
```

### Шаг 5: Установите build на устройство
После сборки вы получите `.ipa` файл или ссылку для установки через TestFlight.

## Решение 2: Bare Workflow (Сложнее)

Если нужен полный контроль:

```bash
npx expo prebuild
```

Затем откройте проект в Xcode и настройте:
1. Signing & Capabilities → добавьте iCloud capability
2. Выберите iCloud Containers
3. Настройте Bundle Identifier
4. Соберите через Xcode

## Текущая реализация

В данный момент приложение использует `FileSystem.documentDirectory`, который:
- ✅ Работает в Expo Go для локального хранения
- ✅ Работает для локальной синхронизации между запусками
- ❌ НЕ синхронизируется с iCloud автоматически в Expo Go
- ✅ БУДЕТ синхронизироваться с iCloud после EAS Build с правильными entitlements

## Конфигурация в app.json

Уже добавлено:
```json
{
  "ios": {
    "usesIcloudStorage": true,
    "infoPlist": {
      "NSUbiquitousContainers": {
        "iCloud.$(CFBundleIdentifier)": {
          "NSUbiquitousContainerIsDocumentScopePublic": true,
          "NSUbiquitousContainerName": "MomentumFlow"
        }
      }
    }
  }
}
```

Эта конфигурация вступит в силу после сборки через EAS Build.

## Проверка iCloud на устройстве

1. Настройки → Apple ID → iCloud → iCloud Drive - должен быть **включен**
2. После установки build проверьте Настройки → Основные → Хранилище iPhone → MomentumFlow
3. Должен появиться пункт "Документы и данные"

## Альтернатива без iCloud

Если не хотите использовать EAS Build, можно:
1. Убрать кнопку синхронизации с iCloud из UI
2. Оставить только локальное хранение через AsyncStorage
3. Использовать Firebase/Supabase для облачной синхронизации (cross-platform)

## Полезные ссылки

- [EAS Build документация](https://docs.expo.dev/build/introduction/)
- [iOS Capabilities](https://docs.expo.dev/build-reference/ios-capabilities/)
- [iCloud в Expo](https://docs.expo.dev/versions/latest/sdk/filesystem/#icloud-support)
