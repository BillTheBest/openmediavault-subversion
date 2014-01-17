/**
 *
 * @license    http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @author     Ian Moore <imooreyahoo@gmail.com>
 * @author     Marcel Beck <marcel.beck@mbeck.org>
 * @author     OpenMediaVault Plugin Developers <plugins@omv-extras.org>
 * @copyright  Copyright (c) 2011 Ian Moore
 * @copyright  Copyright (c) 2012 Marcel Beck
 * @copyright  Copyright (c) 2013-2014 OpenMediaVault Plugin Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
// require("js/omv/WorkspaceManager.js")
// require("js/omv/workspace/form/Panel.js")
// require("js/omv/workspace/window/Form.js")
// require("js/omv/data/Store.js")
// require("js/omv/data/Model.js")
// require("js/omv/data/proxy/Rpc.js")
// require("js/omv/workspace/window/plugin/ConfigObject.js")
// require("js/omv/form/field/SharedFolderComboBox.js")

/**
 * @class OMV.module.admin.service.subversion.Settings
 * @derived OMV.workspace.form.Panel
 */
Ext.define("OMV.module.admin.service.subversion.Settings", {
    extend : "OMV.workspace.form.Panel",

    rpcService   : "Subversion",
    rpcGetMethod : "getSettings",
    rpcSetMethod : "setSettings",

    initComponent : function () {
        var me = this;

        me.on('load', function () {
            var checked = me.findField('enable').checked;
            var parent = me.up('tabpanel');

            if (!parent)
                return;

            var repoPanel = parent.down('panel[title=' + _("Repositories") + ']');

            if (repoPanel) {
                checked ? repoPanel.enable() : repoPanel.disable();
            }
        });

        me.callParent(arguments);
    },


    getFormItems : function () {
        return [{
            xtype    : "fieldset",
            title    : _("General settings"),
            defaults : {
                labelSeparator : ""
            },
            items    : [{
                xtype      : "checkbox",
                name       : "enable",
                fieldLabel : _("Enable"),
                checked    : false
            },{
                xtype      : "textfield",
                name       : "realm",
                fieldLabel : _("Realm Name"),
                allowBlank : false,
                value      : "Subversion Repository on OpenMediaVault",
                plugins    : [{
                    ptype : "fieldinfo",
                    text  : _("Authentication realm.")
                }]
            },{
                xtype      : "checkbox",
                name       : "require-auth",
                fieldLabel : _("Require Authentication"),
                boxLabel   : _("Uncheck to allow anonymous access to one or more repositories. Permissions can be further restricted per repository."),
                checked    : true
            },{
                xtype         : "combo",
                name          : "mntentref",
                fieldLabel    : _("Database Volume"),
                emptyText     : _("Select a volume ..."),
                allowBlank    : false,
                allowNone     : false,
                editable      : false,
                triggerAction : "all",
                displayField  : "description",
                valueField    : "uuid",
                store         : Ext.create("OMV.data.Store", {
                    autoLoad : true,
                    model    : OMV.data.Model.createImplicit({
                        idProperty  : "uuid",
                        fields      : [
                            { name : "uuid", type : "string" },
                            { name : "devicefile", type : "string" },
                            { name : "description", type : "string" }
                        ]
                    }),
                    proxy : {
                        type    : "rpc",
                        rpcData : {
                            service : "ShareMgmt",
                            method  : "getCandidates"
                        },
                        appendSortParams : false
                    },
                    sorters : [{
                        direction : "ASC",
                        property  : "devicefile"
                    }]
                }),
                plugins : [{
                    ptype : "fieldinfo",
                    text  : _("Database files will move to new location if database volume is changed.")
                }]
            },{
                xtype      : "textfield",
                name       : "repository-root",
                fieldLabel : _("Repository root"),
                allowNone  : true,
                readOnly   : true
            }]
        }];
    }
});

OMV.WorkspaceManager.registerPanel({
    id        : "settings",
    path      : "/service/subversion",
    text      : _("Settings"),
    position  : 10,
    className : "OMV.module.admin.service.subversion.Settings"
});
