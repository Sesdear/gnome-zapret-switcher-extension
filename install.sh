#!/bin/bash
UUID="zapret-switcher@sesdear.github.io"
EXTENSION_DIR="$HOME/.local/share/gnome-shell/extensions/$UUID"

echo "Установка Zapret Switcher..."
echo "UUID: $UUID"

mkdir -p "$EXTENSION_DIR"
echo "Создана папка: $EXTENSION_DIR"

if [ ! -f metadata.json ]; then
    echo "metadata.json не найден в текущей папке!"
    exit 1
fi
if [ ! -f extension.js ]; then
    echo "extension.js не найден в текущей папке!"
    exit 1
fi

cp metadata.json extension.js "$EXTENSION_DIR/"
echo "Файлы скопированы"

chmod 644 "$EXTENSION_DIR"/*
echo "Права установлены"

GNOME_VERSION=$(gnome-shell --version | grep -oP '\d+\.\d+')
echo "GNOME Shell: $GNOME_VERSION"

if gnome-extensions list | grep -q "$UUID"; then
    gnome-extensions disable "$UUID"
fi
gnome-extensions enable "$UUID"
echo "Расширение активировано: $UUID"

echo "Перезапускаем GNOME Shell (Alt+F2 → r → Enter)..."
echo "Или выполните вручную: Alt+F2, введите 'r', Enter"

if systemctl is-active --quiet zapret 2>/dev/null; then
    echo "ℹСервис 'zapret' сейчас активен"
else
    echo "ℹСервис 'zapret' сейчас неактивен"
fi

echo ""
echo "УСТАНОВКА ЗАВЕРШЕНА!"
echo "Для удаления:"
echo "  rm -rf $EXTENSION_DIR"
echo "  gnome-extensions disable $UUID 2>/dev/null || true"