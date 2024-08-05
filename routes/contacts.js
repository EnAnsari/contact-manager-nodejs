const express = require('express');
const contactsController = require('../controllers/contactsController');

const router = express.Router();

router.post('/', contactsController.createContact);
router.get('/', contactsController.getContacts);
router.get('/:id', contactsController.getContactById);
router.put('/:id', contactsController.updateContact);
router.delete('/:id', contactsController.deleteContact);
// router.get('/:id/image', contactsController.getContactImage);

module.exports = router;