import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import St from 'gi://St';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

export default class ZapretSwitcherExtension extends Extension {

    enable() {
        this._button = new PanelMenu.Button(0.0, 'ZapretSwitcher');

        this._icon = new St.Icon({
            icon_size: 18,
            style_class: 'system-status-icon',
        });

        this._button.add_child(this._icon);

        this._switchItem = new PopupMenu.PopupSwitchMenuItem('Zapret', false);
        this._switchItem.connect('toggled', (_, state) => {
            this.toggleService(state);
        });

        this._button.menu.addMenuItem(this._switchItem);

        Main.panel.addToStatusArea('zapret-switcher', this._button);

        this.updateState();
    }

    toggleService(state) {
        const cmd = `pkexec systemctl ${state ? 'start' : 'stop'} zapret`;
        GLib.spawn_command_line_async(cmd);
        this.updateIcon(state);
    }

    updateState() {
        GLib.spawn_command_line_async('systemctl is-active --quiet zapret',
            (success) => {
                const active = (success === 0);
                this._switchItem.setToggleState(active);
                this.updateIcon(active);
            });
    }

    updateIcon(active) {
        const iconName = active ? 'logo-on.svg' : 'logo-off.svg';
        this._icon.gicon = Gio.icon_new_for_string(`${this.path}/icons/${iconName}`);
    }

    disable() {
        if (this._button) {
            this._button.destroy();
            this._button = null;
        }
        this._icon = null;
        this._switchItem = null;
    }
}