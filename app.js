const express = require('express');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

const dotenv = require('dotenv');
dotenv.config();

//express app
const app = express();

//register view engine
app.set('view engine', 'ejs');

//establish connection to MongoDb
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Mongodb Connection Successful');

    //listen for requests
    app.listen(3000, () => {
      console.log('Backend server is running');
    });
  })
  .catch((err) => console.log(err));

//middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); //handle forms

//Get req, redirects to home
app.get('/', (req, res) => {
  //res.sendFile('./views/index.html', { root: __dirname });

  res.redirect('/blogs');
});

//Get about page
app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

//Get create blog page
app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create A New Blog' });
});

app.get('/blogs', (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render('index', { blogs: result, title: 'All blogs' });
    })
    .catch((err) => {
      console.log(err);
    });
});

//Post created blog
app.post('/blogs', (req, res) => {
  //console.log(req.body);

  const blog = new Blog(req.body);

  blog
    .save()
    .then((result) => {
      res.redirect('/blogs');
    })
    .catch((err) => {
      console.log(err);
    });
});

//Get single blog
app.get('/blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((result) => {
      res.render('details', { blog: result, title: 'Blog Details' });
    })
    .catch((err) => {
      console.log(err);
    });
});

//Updating a  blog

app.get('/blogs/create/:id', async (req, res) => {
  const id = req.params.id;

  Blog.findById(id)
    .then((result) => {
      // console.log(result);
      res.render('update', { blog: result, title: 'update blog' });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.put('/blogs/:id', async (req, res) => {
  const id = req.params.id;
  const blog = req.body;
  //const {title,snippet,body}=req.body
  console.log(blog, id);

  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });

    res.status(200).json(updatedUser).redirect('/blogs');
  } catch (error) {
    res.status(500).json(error);
  }
});

//Delete blog
app.delete('/blogs/:id', (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: '/blogs' });
    })
    .catch((err) => {
      console.log(err);
    });
});

//404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
