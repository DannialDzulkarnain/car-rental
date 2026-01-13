import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { uploadFile, getFileUrl } from '../../lib/storage';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Article } from '../../../types';
import { useAuth } from '../../context/AuthContext';
import { FileText, Copy, X, Info } from 'lucide-react';

// Article Templates for SEO
const ARTICLE_TEMPLATES = [
  {
    name: 'Airport Transfer',
    title: 'Airport Transfer from KLIA to [Location] - Premium Chauffeur Service',
    excerpt: 'Looking for reliable airport transfer from KLIA to [Location]? TRAVTHRU offers premium chauffeur services with fixed rates, no surge pricing, and professional drivers available 24/7.',
    content: `## Premium KLIA Airport Transfer Service

Arriving at Kuala Lumpur International Airport (KLIA) or KLIA2? Start your Malaysian journey with comfort and style with TRAVTHRU's premium airport transfer service to [Location].

## Why Choose TRAVTHRU?

- **Fixed Pricing** - No surge pricing or hidden fees
- **24/7 Availability** - We operate around the clock
- **Flight Tracking** - Our drivers monitor your flight
- **Professional Drivers** - Experienced and courteous
- **Premium Fleet** - Toyota Alphard, Hyundai Staria, Mercedes-Benz

## Airport Transfer Rates

| Vehicle | Price |
|---------|-------|
| Economy Sedan | RM90 |
| Standard MPV | RM180 |
| Premium MPV | RM300 |
| Luxury | RM350 |

## How to Book

WhatsApp us at +60107198186 with your flight details. We'll confirm within minutes!

## Service Areas

We cover all KL areas including Bukit Bintang, KLCC, Bangsar, Mont Kiara, and Petaling Jaya.`
  },
  {
    name: 'Genting Trip',
    title: 'Private Transfer to Genting Highlands - Comfortable Journey',
    excerpt: 'Planning a trip to Genting Highlands? TRAVTHRU provides comfortable private transfers with experienced drivers who know the mountain roads well.',
    content: `## Genting Highlands Private Transfer

Escape to the cool mountains of Genting Highlands with TRAVTHRU's private transfer service.

## Why Private Transfer to Genting?

- **Comfortable Journey** - Relax in our premium vehicles
- **Experienced Drivers** - Familiar with mountain roads
- **Door-to-Door Service** - Pickup from anywhere in KL
- **Flexible Timing** - Travel at your convenience

## Rates

| Vehicle | One Way | Round Trip |
|---------|---------|------------|
| Standard | RM180 | RM300 |
| Premium MPV | RM250 | RM400 |
| Luxury | RM350 | RM550 |

## What's Included

- Professional driver
- Toll charges
- Waiting time (up to 1 hour)
- Mineral water

## Book Now

WhatsApp: +60107198186`
  },
  {
    name: 'Corporate Service',
    title: 'Corporate Chauffeur Service in Kuala Lumpur - Professional Business Transport',
    excerpt: 'Need reliable corporate transportation in KL? TRAVTHRU offers professional chauffeur services for executives and business travelers.',
    content: `## Corporate Chauffeur Service

TRAVTHRU provides premium corporate transportation for businesses in Kuala Lumpur.

## Our Corporate Services

- **Executive Transfers** - Airport to hotel/office
- **Business Meetings** - Reliable point-to-point service
- **Corporate Events** - Group transportation
- **VIP Clients** - Impress important guests

## Benefits

- **Punctuality Guaranteed** - We understand time is money
- **Professional Drivers** - Well-groomed and courteous
- **Premium Fleet** - Mercedes-Benz, Toyota Alphard
- **Corporate Accounts** - Monthly billing available

## Contact Us

For corporate inquiries:
- WhatsApp: +60107198186
- Email: booking@travthru.com`
  }
];

interface ArticleEditorProps {
  onClose: () => void;
  editArticle?: Article | null;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({ onClose, editArticle }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // Load existing article data for editing
  useEffect(() => {
    if (editArticle) {
      setTitle(editArticle.title || '');
      setContent(editArticle.content || '');
      setExcerpt(editArticle.excerpt || '');
      setImage(editArticle.image || '');
    }
  }, [editArticle]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      try {
        const response = await uploadFile(e.target.files[0]);
        if (response.success && response.url) {
          setImage(response.url);
        } else {
          throw new Error(response.error || 'Upload failed');
        }
      } catch (error) {
        console.error("Upload failed", error);
        alert("Image upload failed");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSave = async (published: boolean) => {
    if (!title || !content) return alert("Title and Content are required");
    
    setSaving(true);
    try {
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const articleData: Partial<Article> = {
            title,
            slug,
            content,
            excerpt: excerpt || content.substring(0, 150) + '...',
            image,
            author: user?.displayName || 'Admin',
            published,
            updatedAt: serverTimestamp(),
        };

        if (editArticle?.id) {
          // Update existing article
          await updateDoc(doc(db, 'car-rental-articles', editArticle.id), articleData);
          alert("Article updated!");
        } else {
          // Create new article
          await addDoc(collection(db, 'car-rental-articles'), {
            ...articleData,
            createdAt: serverTimestamp(),
          });
          alert("Article saved!");
        }
        onClose();
    } catch (error) {
        console.error("Error saving article:", error);
        alert("Failed to save article");
    } finally {
        setSaving(false);
    }
  };

  const applyTemplate = (template: typeof ARTICLE_TEMPLATES[0]) => {
    setTitle(template.title);
    setExcerpt(template.excerpt);
    setContent(template.content);
    setShowTemplates(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{editArticle ? 'Edit Article' : 'New Article'}</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowGuide(!showGuide)} 
            className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
          >
            <Info className="w-4 h-4" />
            Guide
          </button>
          <button 
            onClick={() => setShowTemplates(!showTemplates)} 
            className="flex items-center gap-1 px-3 py-1 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100"
          >
            <FileText className="w-4 h-4" />
            Templates
          </button>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Writing Guide */}
      {showGuide && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-bold text-blue-900 mb-2">📝 SEO Writing Guide</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Title:</strong> Include keywords like "Airport Transfer", "KLIA", location name</li>
            <li>• <strong>Excerpt:</strong> 1-2 sentences summary with main keywords</li>
            <li>• <strong>Content:</strong> Use simple formatting:</li>
            <li className="ml-4">- <code>## Heading</code> for section titles</li>
            <li className="ml-4">- <code>- Item</code> for bullet points</li>
            <li className="ml-4">- <code>**bold**</code> for emphasis</li>
            <li>• <strong>Image:</strong> Upload relevant photo (car, location, service)</li>
            <li>• <strong>SEO Tips:</strong> Mention "TRAVTHRU", service type, and location multiple times</li>
          </ul>
        </div>
      )}

      {/* Templates */}
      {showTemplates && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-bold text-green-900 mb-3">📋 Article Templates</h3>
          <div className="grid gap-3">
            {ARTICLE_TEMPLATES.map((template, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-white rounded border">
                <div>
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  <p className="text-sm text-gray-500">{template.title.substring(0, 50)}...</p>
                </div>
                <button
                  onClick={() => applyTemplate(template)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  <Copy className="w-3 h-3" />
                  Use
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title *</label>
          <input 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
            placeholder="Airport Transfer from KLIA to Bukit Bintang"
          />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Featured Image</label>
            <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload} 
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploading && <p className="text-sm text-blue-500 mt-1">Uploading...</p>}
            {image && (
                <img src={getFileUrl(image)} alt="Preview" className="mt-2 h-32 w-auto object-cover rounded" />
            )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Excerpt (Short Description) *</label>
          <textarea 
            value={excerpt} 
            onChange={e => setExcerpt(e.target.value)} 
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
            placeholder="Looking for reliable airport transfer from KLIA? TRAVTHRU offers premium service..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Content *</label>
          <textarea 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            rows={12}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border font-mono"
            placeholder="## Premium Airport Transfer Service

Write your article content here. Use:
- ## for headings
- - for bullet points
- **text** for bold"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
                onClick={() => handleSave(false)}
                disabled={saving || uploading}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
                Save Draft
            </button>
            <button 
                onClick={() => handleSave(true)}
                disabled={saving || uploading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
                {saving ? 'Saving...' : (editArticle ? 'Update & Publish' : 'Publish')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;
