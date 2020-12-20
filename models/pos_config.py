# -*- coding: utf-8 -*-

from odoo import models, fields, api, _
from odoo.exceptions import ValidationError


class PosConfig(models.Model):
    _inherit = 'pos.config'

    lock_price = fields.Boolean(string="Lock price", default=False)
    price_password = fields.Char(string=u"Password")
    lock_discount = fields.Boolean(string="Lock discount", default=False)
    discount_password = fields.Char(string=u"Password")
    lock_free = fields.Boolean(string="Lock free", default=False)
    free_password = fields.Char(string=u"Password")
    lock_loss = fields.Boolean(string="Lock loss", default=False)
    loss_password = fields.Char(string=u"Password")

    @api.constrains('price_password', 'discount_password',
                    'free_password', 'loss_password')
    def check_password(self):
        if self.lock_price is True:
            for item in str(self.price_password):
                try:
                    int(item)
                except Exception as e:
                    raise ValidationError(_("The unlock price password should be a number"))
        if self.lock_discount is True:
            for item in str(self.discount_password):
                try:
                    int(item)
                except Exception as e:
                    raise ValidationError(_("The unlock discount password should be a number"))

        if self.lock_free is True:
            for item in str(self.free_password):
                try:
                    int(item)
                except Exception as e:
                    raise ValidationError(_("The unlock free password should be a number"))
        if self.lock_loss is True:
            for item in str(self.loss_password):
                try:
                    int(item)
                except Exception as e:
                    raise ValidationError(_("The unlock loss password should be a number"))
