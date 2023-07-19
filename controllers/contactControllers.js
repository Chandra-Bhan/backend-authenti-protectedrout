const asyncHandler = require("express-async-handler");
// const Contact = require("../config/dbConnection");
const Contact = require("../models/contactModel");
//@desc Get contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

//@desc Create New contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields must be filled");
  }
  const contact = new Contact({
    name,
    email,
    password,
    user_id: req.user.id,
  });
  contact
    .save()
    .then(() => {
      res.send(req.body);
      console.log(req.body);
    })
    .catch((err) => {
      res.send(err.message);
      console.log(err);
    });
  // res.status(201).json({ message: "Create Contact" });
});

//@desc Get contact
//@route GET /api/contacts:id
//@access private
const getContact = asyncHandler(async (req, res) => {
  const _id = req.params.id;
  const contactInfo = await Contact.findById(_id);

  res.status(201).json({
    message: `Get Contact for ${req.params.id}`,
    contact: contactInfo,
  });
});

//@desc Update contacts
//@route PUT /api/contacts:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
  const _id = req.params.id;

  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not Found");
  }
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error(
      "User don't have permission to update other user contact info"
    );
  }

  const updatedData = await Contact.findByIdAndUpdate(_id, req.body);
  res.status(201).json({ message: `Updated contact for ${req.params.id}` });
});

//@desc Delete contact
//@route DELETE /api/contacts:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
  const _id = req.params.id;
  const contact = await Contact.findById(_id);

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error(
      "User dont' have permission to delete other user contact info"
    );
  }

  await Contact.deleteOne({ _id: req.params.id });
  res.status(201).json({ message: `Deleted contact for ${req.params.id}` });
});

module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
};
