const { St, PanelMenu, GLib } = imports.gi;
const PopupMenu = imports.ui.popupMenu;
const Main = imports.ui.main;

let toggleServiceButton;

function init() {}

function enable() {
    toggleServiceButton = new PanelMenu.Button(0.0, 'ZapretSwitcher');
    
    const icon = new St.Icon({ 
        icon_name: 'system-run-symbolic',
        style_class: 'system-status-icon'
    });
    toggleServiceButton.add_actor(icon);
    
    const item = new PopupMenu.PopupSwitchMenuItem('Zapret', false);
    item.connect('toggled', (self, state) => {
        GLib.spawn_command_line_async(`systemctl ${state ? 'start' : 'stop'} zapret`);
    });
    toggleServiceButton.menu.addMenuItem(item);
    
    Main.panel.addToStatusArea('Zapret', toggleServiceButton);
}

function disable() {
    if (toggleServiceButton) {
        toggleServiceButton.destroy();
    }
}
