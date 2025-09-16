# Resonance Tracker

A simple, minimal Next.js web app for tracking what raises your resonance.

## Features

- **Log Resonance**: Record the time, date, and note of what raised your resonance
- **View Entries**: Browse your logged resonance entries in a clean, minimal UI
- **MongoDB Storage**: Data is stored in MongoDB Atlas (cloud database)
- **Data Migration**: Automatically migrates existing localStorage data to database
- **Minimal Design**: Clean journal-style interface focused on simplicity

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your MongoDB database:
   - Create a MongoDB Atlas account (free tier available) at [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create a new cluster and database
   - Get your connection string
   - Copy `env.example` to `.env.local` and add your MongoDB URI:
     ```bash
     cp env.example .env.local
     ```
   - Edit `.env.local` and replace `your_mongodb_connection_string_here` with your actual MongoDB URI

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **React 18** with hooks
- **MongoDB** with Mongoose for data persistence
- **RESTful API** routes for CRUD operations

## Usage

1. Enter a note describing what raised your resonance
2. Click "Log Entry" to save it
3. View all your entries below, sorted by most recent first
4. Delete entries you no longer need

Your data is automatically saved to MongoDB and syncs across all your devices. Any existing localStorage data will be automatically migrated to the database on first use.

## Database Features

- **Cloud Storage**: Data stored in MongoDB Atlas
- **Auto Migration**: Existing localStorage data automatically migrated
- **Cross-Device Sync**: Access your entries from any device
- **Data Backup**: Your entries are safely stored in the cloud
- **Error Handling**: Graceful error handling with user feedback
