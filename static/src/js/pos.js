odoo.define('custom_pos.free_lost_mode', function (require) {
    "use strict";

    var core = require('web.core');
    var QWeb = core.qweb;
    var _t = core._t;
    var screens = require('point_of_sale.screens');
    var models = require('point_of_sale.models')
    var NumpadWidget = screens.NumpadWidget;
    var OrderWidget = screens.OrderWidget;
    var rpc = require('web.rpc');
    var utils = require('web.utils');
    var round_di = utils.round_decimals;
    var round_pr = utils.round_precision;
    var session = require('web.session');

    NumpadWidget.include({
        clickChangeMode: function (event) {
            var self = this;
            var mode = self.state.get('mode');
            var employee = self.pos.get_cashier()|| self.pos.get('cashier') || self.employee;
            var newMode = event.currentTarget.attributes['data-mode'].nodeValue;
            if (mode == newMode) {
                return self.state.changeMode(newMode);
            }
            var order = this.pos.get_order();
            if (newMode == 'discount') {
                if(employee.id){
                    rpc.query({
                        model: 'hr.employee',
                        method: 'read',
                        args: [[employee.id], ['edit_discount']],
                        kwargs: {context: session.user_context},
                    })
                    .then(function (result){
                        if (result[0].edit_discount == false) {
                            self.gui.show_popup('password', {
                                'title': _t('Password ?'),
                                confirm: function (pw) {
                                    if (pw !== self.pos.config.discount_password) {
                                        self.gui.show_popup('error', {
                                            'title': _t('Error'),
                                            'body': _t('Incorrect password. Please try again'),
                                        });
                                    } else {
                                        return self.state.changeMode(newMode);
                                    }
                                },
                            });
                        }
                        else {
                            return self.state.changeMode(newMode);
                        }
                        });
                }}
            else if (newMode == 'price') {
                 if(employee.id){
                     rpc.query({
                        model: 'hr.employee',
                        method: 'read',
                        args: [[employee.id], ['edit_price']],
                    })
                    .then(function (result){
                        if (result[0].edit_price == false) {
                            self.gui.show_popup('password', {
                                'title': _t('Password ?'),
                                confirm: function (pw) {
                                    if (pw !== self.pos.config.price_password) {
                                        self.gui.show_popup('error', {
                                            'title': _t('Error'),
                                            'body': _t('Incorrect password. Please try again'),
                                        });
                                    } else {
                                        return self.state.changeMode(newMode);
                                    }
                                },
                            });
                        }
                        else {
                        return self.state.changeMode(newMode);
                        }
                    });
                }}
            else if (newMode == 'free') {
                if(employee.id){
                     rpc.query({
                        model: 'hr.employee',
                        method: 'read',
                        args: [[employee.id], ['free']],
                    })
                    .then(function (result){
                        if (result[0].free == false) {
                            self.gui.show_popup('password', {
                                'title': _t('Password ?'),
                                confirm: function (pw) {
                                    if (pw !== self.pos.config.free_password) {
                                        self.gui.show_popup('error', {
                                            'title': _t('Error'),
                                            'body': _t('Incorrect password. Please try again'),
                                        });
                                    } else {
                                        if (order.get_selected_orderline()) {
                                            var selected_orderline = order.get_selected_orderline();
                                            selected_orderline.free =true;
                                            }
                                    }
                                },
                            });
                        }
                        else {
                            if (order.get_selected_orderline()) {
                                var selected_orderline = order.get_selected_orderline();
                                selected_orderline.free =true;
                                }

                            }
                        });
                }
            }
            else if (newMode == 'loss') {
                if(employee.id){
                     rpc.query({
                        model: 'hr.employee',
                        method: 'read',
                        args: [[employee.id], ['loss']],
                    })
                    .then(function (result){
                        if (result[0].loss== false) {
                            self.gui.show_popup('password', {
                                'title': _t('Password ?'),
                                confirm: function (pw) {
                                    if (pw !== self.pos.config.loss_password) {
                                        self.gui.show_popup('error', {
                                            'title': _t('Error'),
                                            'body': _t('Incorrect password. Please try again'),
                                        });
                                    } else {
                                       console.log('loss')
                                        console.log(order.get_selected_orderline())
                                        if (order.get_selected_orderline()) {
                                            var selected_loss_orderline = order.get_selected_orderline();
                                            selected_loss_orderline.loss =true;
                                            }
                                    }
                                },
                            });
                        }
                        else {
                           if (order.get_selected_orderline()) {
                               var selected_loss_orderline = order.get_selected_orderline();
                               selected_loss_orderline.loss =true;
                           }
                        }
                        });
                }
            }else {
                return self.state.changeMode(newMode);
            }
        },
    });
   var _super_orderline = models.Orderline.prototype;
   models.Orderline = models.Orderline.extend({
        export_as_JSON: function() {
                var json = _super_orderline.export_as_JSON.apply(this, arguments);
                json.free = this.free
                    ? this.free
                    : false;
                json.loss = this.loss
                    ? this.loss
                    : false;
                return json;
        },
        export_for_printing: function(){
            var json = _super_orderline.export_for_printing.apply(this, arguments);
            json.free = this.free
                        ? this.free
                        : false;
            json.loss = this.loss
                        ? this.loss
                        : false;
                    return json;
        },
        init_from_JSON: function(json) {
           _super_orderline.init_from_JSON.apply(this, arguments);
               this.free = json.free;
               this.loss = json.loss;
        },
   })

});