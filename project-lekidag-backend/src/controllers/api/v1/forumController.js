/**
 * @file Defines the ForumController class.
 * @module controllers/api/v1/forumController.js
 * @author Mathilda Segerlund
 */

import { ForumModel } from '../../../models/forumModel.js'

/**
 * Encapsulates a controller for handling forum functionality.
 */
export class ForumController {
  /**
   * List all forum posts.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
    // Collect all created forum posts and sort them to display the last created first.
      const allPosts = await ForumModel.find().sort({ createdAt: -1 })
      res.status(200).json(allPosts)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Display a single forum post by ID.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async displayPost (req, res, next) {
    try {
      // Find a post based on id from request parameter.
      const onePost = await ForumModel.findById(req.params.id)

      // Return error message if not found.
      if (!onePost) {
        res.status(404).json({ error: 'Inlägget kunde inte hittas.' })
        return
      }

      // Send the post as JSON.
      res.status(200).json(onePost)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Create a new forum post.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async createPost (req, res, next) {
    try {
      // Collect the title, content and category from request body.
      const { title, content, category } = req.body

      // Ensure required fields are provided.
      if (!title || !content) {
        res.status(400).json({ error: 'Titel och innehåll krävs.' })
        return
      }

      // Create a new post with the provided data from request body. Save it to the database.
      const addPost = await ForumModel.create({
        title,
        content,
        category,
        author: req.user.id,
        authorUsername: req.user.username
      })

      // Send message and created post.
      res.status(201).json({ message: 'Inlägg skapat!', addPost })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update an existing forum post.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async updatePost (req, res, next) {
    try {
      // Find a post based on id from request parameter.
      const thePost = await ForumModel.findById(req.params.id)

      if (!thePost) {
        res.status(404).json({ error: 'Inlägget kunde inte hittas.' })
        return
      }

      // Validate that the logged-in user is the post owner
      if (thePost.author.toString() !== req.user.id) {
        res.status(403).json({ error: 'Du får bara redigera dina egna inlägg.' })
        return
      }

      // Update the fields that were provided in the request
      thePost.title = req.body.title || thePost.title
      thePost.content = req.body.content || thePost.content
      thePost.category = req.body.category || thePost.category
      thePost.updatedAt = new Date()

      // Save the post to the database.
      await thePost.save()

      // Send message and updated post.
      res.status(200).json({ message: 'Inlägg uppdaterat.', post: thePost })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Delete an existing forum post.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async deletePost (req, res, next) {
    try {
      // Find a post based on id from request parameter.
      const thePost = await ForumModel.findById(req.params.id)

      if (!thePost) {
        res.status(404).json({ error: 'Inlägget kunde inte hittas.' })
        return
      }

      // Validate that the logged-in user is the post owner
      if (thePost.author.toString() !== req.user.id) {
        res.status(403).json({ error: 'Du får bara ta bort dina egna inlägg.' })
        return
      }

      // Delete the post from the database
      await thePost.deleteOne()

      // Return 204 No Content to indicate success
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}
