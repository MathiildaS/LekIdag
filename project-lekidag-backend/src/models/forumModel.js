/**
 * @file Defines a schema for a forum post.
 * @module models/forumModel.js
 * @author Mathilda Segerlund <ms228qs@student.lnu.se>
 */

import mongoose from 'mongoose'
import { DEFAULT_SCHEMA } from './defaultSchema.js'

// Create a schema for a forum post.
const forumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 100
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Lekar', 'Pyssel', 'Utmaningar', 'Väder', 'Badplatser', 'Lekplatser', 'Allmänt'],
    default: 'Allmänt'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorUsername: {
    type: String,
    required: true,
    trim: true
  },
  updatedAt: {
    type: Date
  }
})

// Attach the base schema to the forum schema.
forumSchema.add(DEFAULT_SCHEMA)

// Create and export the model.
export const ForumModel = mongoose.model('Forum', forumSchema)
