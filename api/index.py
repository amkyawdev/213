"""
Burme AI - API Routes for Vercel Serverless Deployment
"""

from .main import app

# Re-export the FastAPI app for Vercel
handler = app