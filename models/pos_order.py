# -*- coding: utf-8 -*-

from odoo import models, fields


class PosOrderLine(models.Model):
    _inherit = "pos.order.line"

    free = fields.Boolean()
    loss = fields.Boolean()
