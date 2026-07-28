import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(`MongoDB connection failed: ${err.message}`)
    // Fail fast - there's no point starting an API server that can't reach its DB
    process.exit(1)
  }
}

export default connectDB
