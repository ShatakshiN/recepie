// creation , deletion , editting, browse, search  - endpoints

const cors = require('cors');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const bodyparser = require('body-parser');
const sequelize = require('../../util/db');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const router= express.Router();
const { Op } = require('sequelize');

//models
const Users  =require('../models/user');
const Recipe = require('../models/recipe');

//middleware 

const authenticate = require('../middleware/auth');

// Configure the AWS SDK
const s3Client = new S3Client({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


// Setup multer to upload files to S3
const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory temporarily
});

// Upload to S3 using the client
const uploadToS3 = async (file) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: Date.now().toString() + '-' + file.originalname, 
    Body: file.buffer,
    ACL: 'public-read',
  };

  const command = new PutObjectCommand(params);
  const uploadResult = await s3Client.send(command);
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${params.Key}`;
};


router.post('/recipes', upload.single('image'), authenticate,async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json({ error: 'Image is required' });
      }

      const imageUrl = await uploadToS3(req.file);

      const newRecipe = await Recipe.create({
          title: req.body.title,
          imageUrl: imageUrl,
          dietaryPreferences: req.body.dietaryPreferences,
          difficultyLevel: req.body.difficultyLevel,
          cookingTime: req.body.cookingTime,
          SignUpId: req.user.id
      });

      console.log('Uploaded file:', req.file);

      res.status(201).json(newRecipe);
  } catch (error) {
      console.error('Error creating recipe:', error); // Log the error for debugging
      res.status(500).json({ error: 'Failed to create recipe' });
  }
});

router.get('/recipes', authenticate,async (req, res) => {
  try {
      const recipes = await Recipe.findAll(); // Fetch all recipes from the database
      res.json(recipes);
  } catch (error) {
      console.error('Error fetching recipes:', error);
      res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

router.get('/All-user', authenticate, async(req,res,next)=>{
  try{
    const userInfo = await Users.findAll();
    res.json(userInfo)
  }catch(e){
    console.error(e);
    res.status(500).json({error : 'failed' })
  }
});

router.get('/recipes/:id', authenticate,async (req, res) => {
  try {
      const { id } = req.params;
      const recipe = await Recipe.findByPk(id);
      if (!recipe) {
          return res.status(404).json({ error: 'Recipe not found' });
      }
      res.json(recipe);
  } catch (error) {
      console.error('Error fetching recipe by ID:', error);
      res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});


router.put('/recipes/:id', upload.single('image'),authenticate ,async (req, res) => {
  try {
    const { id } = req.params;
    const { title, dietaryPreferences, difficultyLevel, cookingTime } = req.body;

    // Find the recipe by ID
    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // If a new image is uploaded, upload it to S3 and update the imageUrl
    let imageUrl = recipe.imageUrl;
    if (req.file) {
      imageUrl = await uploadToS3(req.file);
    }

    // Update the recipe with the new data
    recipe.title = title || recipe.title;
    recipe.dietaryPreferences = dietaryPreferences || recipe.dietaryPreferences;
    recipe.difficultyLevel = difficultyLevel || recipe.difficultyLevel;
    recipe.cookingTime = cookingTime || recipe.cookingTime;
    recipe.imageUrl = imageUrl;

    await recipe.save();

    res.status(200).json(recipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
});


router.delete('/recipes/:id', authenticate,async (req, res) => {
  try {
      const { id } = req.params;
      await Recipe.destroy({ where: { id } }); // Delete the recipe by ID
      res.status(204).send(); // Send a No Content response
  } catch (error) {
      console.error('Error deleting recipe:', error);
      res.status(500).json({ error: 'Failed to delete recipe' });
  }
});


router.get('/search-recipe', authenticate,async (req, res) => {
  try {
    const { title, dietaryPreferences, difficultyLevel } = req.query;

    // Create an array to hold query conditions
    const conditions = [];

    // Add conditions based on provided query parameters
    if (title) {
      conditions.push({ title: { [Op.like]: `%${title}%` } }); // Use Op.like for partial matching
    }
    if (dietaryPreferences) {
      conditions.push({ dietaryPreferences: dietaryPreferences });
    }
    if (difficultyLevel) {
      conditions.push({ difficultyLevel: difficultyLevel });
    }

    // Find recipes based on the constructed conditions
    const findRecipes = await Recipe.findAll({
      where: {
        [Op.and]: conditions.length > 0 ? conditions : [{ id: null }] // If no conditions, avoid querying
      }
    });

    res.status(200).json(findRecipes); // Send the found recipes
  } catch (error) {
    console.error('Error finding recipe:', error);
    res.status(500).json({ error: 'Failed to find recipe' });
  }
});


module.exports = router;






