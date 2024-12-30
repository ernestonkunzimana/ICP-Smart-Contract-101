// cannister code goes here
import { v4 as uuidv4 } from "uuid";
import { StableBTreeMap, ic } from "azle";
import express from "express";

/**
    This type represents a message that can be listed on a board.
*/
class Message {
    id: string;
    title: string;
    body: string;
    attachmentURL: string;
    createdAt: Date;
    updatedAt: Date | null
 }

 const messagesStorage = StableBTreeMap<string, Message>(0);
 const app = express();
 app.use(express.json());

 app.post("/messages", (req, res) => {
    const message: Message =  {id: uuidv4(), createdAt: getCurrentDate(), ...req.body};
    messagesStorage.insert(message.id, message);
    res.json(message);
 });

 // Retrieving added message, we will use the below codes

 app.get("/messages", (req, res) => {
    res.json(messagesStorage.values());
 });

//the below code is used to get a specific message by its id

 app.get("/messages/:id", (req, res) => {
    const messageId = req.params.id;
    const messageOpt = messagesStorage.get(messageId);
    if (!messageOpt) {
       res.status(404).send(`the message with id=${messageId} not found`);
    } else {
       res.json(messageOpt.Some);
    }
});
// The below function is for updating messages or an existing message
app.put("/messages/:id", (req, res) => {
    const messageId = req.params.id;
    const messageOpt = messagesStorage.get(messageId);
    if (!messageOpt) {
       res.status(400).send(`Couldn't update a message with id=${messageId}. Message not found.`);
    } else {
       const message = messageOpt.Some;
       if (message) {
           const updatedMessage = { ...message, ...req.body, updatedAt: getCurrentDate() };
           messagesStorage.insert(message.id, updatedMessage);
           res.json(updatedMessage);
       } else {
           res.status(400).send(`Couldn't update a message with id=${messageId}. Message not found.`);
       }
    }
});

// Our canister dapp development needs a way to allow us to create a function to delete a certain message
app.delete("/messages/:id", (req, res) => {
    const messageId = req.params.id;
    const messageOpt = messagesStorage.get(messageId);
    if (!messageOpt) {
        res.status(400).send(`Couldn't delete a message with id=${messageId}. Message not found.`);
    } else {
        messagesStorage.remove(messageId);
        res.status(200).send(`Message with id=${messageId} deleted successfully.`);
    }
});

 app.listen();

 function getCurrentDate() {
    const timestamp = new Number(ic.time());
    return new Date(timestamp.valueOf() / 1000_000);
}