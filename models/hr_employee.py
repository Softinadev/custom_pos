# -*- coding: utf-8 -*-

from odoo import models, fields, api, _
from odoo.exceptions import ValidationError


class HrEmployee(models.Model):
    _inherit = 'hr.employee'

    edit_price = fields.Boolean('Can edit price')
    edit_discount = fields.Boolean('Can edit discount')
    free = fields.Boolean()
    loss = fields.Boolean()
