const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const user = req.body.username;
    const pass = req.body.password;
  
    if(user && pass){
      const containsValue = users.some( u => u.username === user)
      if(containsValue){
          return res.status(400).json({message: "User already exists"})
      }
  
      users.push({"username": user,"password": pass});
      return res.status(200).json({message: "User registered succesfully"});
    }

    return res.status(400).json({message: "Try a different username"})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books));
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
 });
  


// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorName = req.params.author.toLowerCase();
    const temp_books = [];

    for (let key in books) {
        if (books[key].author.toLowerCase() === authorName) {
            temp_books.push({ id: key, ...books[key] });
        }
    }

    if (temp_books.length > 0) {
        return res.status(200).json(temp_books);
    } else {
        return res.status(404).json({ message: "No author found" });
    }
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.toLocaleLowerCase();
    const temp_books = [];

    for(let key in books){
        if(books[key].title.toLocaleLowerCase() === title){
            temp_books.push({id: key, ...books[key]})
        }
    }

    if (temp_books.length > 0) {
        return res.status(200).json(temp_books);
    } else {
        return res.status(404).json({ message: "No title found" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const reviews = books[isbn].reviews;
  return res.status(200).json(reviews)
});

module.exports.general = public_users;
