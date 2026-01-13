import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Article } from '../../types';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      
      try {
        // Fetch article by slug
        const q = query(
          collection(db, 'car-rental-articles'),
          where('slug', '==', slug),
          where('published', '==', true),
          limit(1)
        );
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          setNotFound(true);
        } else {
          const articleData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Article;
          setArticle(articleData);
          
          // Update page title for SEO
          document.title = `${articleData.title} | TRAVTHRU`;
          
          // Update meta description
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute('content', articleData.excerpt);
          }
          
          // Fetch related articles (excluding current)
          const relatedQ = query(
            collection(db, 'car-rental-articles'),
            where('published', '==', true),
            limit(3)
          );
          const relatedSnapshot = await getDocs(relatedQ);
          setRelatedArticles(
            relatedSnapshot.docs
              .map(d => ({ id: d.id, ...d.data() } as Article))
              .filter(a => a.slug !== slug)
              .slice(0, 2)
          );
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-900 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading article...</p>
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-500 mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/articles" className="text-gold-600 hover:text-gold-700 font-semibold">
            ← Back to Articles
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Image */}
      <section className="pt-24">
        <div className="h-64 md:h-96 w-full overflow-hidden">
          <img
            src={article.image || '/placeholder-article.jpg'}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link 
            to="/articles" 
            className="inline-flex items-center text-gray-500 hover:text-brand-900 mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Articles
          </Link>
          
          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight mb-6">
              {article.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {article.createdAt?.toDate?.()?.toLocaleDateString('en-MY', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) || 'Recently Published'}
                </span>
              </div>
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 text-gold-600 hover:text-gold-700"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
            
            {/* Excerpt */}
            <p className="text-xl text-gray-600 leading-relaxed border-l-4 border-gold-500 pl-4">
              {article.excerpt}
            </p>
          </header>
          
          {/* Article Body */}
          <div 
            className="prose prose-lg max-w-none prose-headings:font-serif prose-a:text-gold-600 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          
          {/* CTA Section */}
          <div className="mt-12 p-8 bg-gradient-to-r from-brand-900 to-brand-800 rounded-2xl text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Need a <span className="text-gold-500">Ride</span>?
            </h3>
            <p className="text-gray-300 mb-6">
              Book your premium transfer service with TRAVTHRU today!
            </p>
            <a 
              href="https://wa.me/60107198186" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-gold-500 text-brand-900 font-bold rounded-lg hover:bg-gold-400 transition-colors"
            >
              Book on WhatsApp
            </a>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8">
              Related Articles
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  to={`/articles/${related.slug}`}
                  className="group flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={related.image || '/placeholder-article.jpg'}
                    alt={related.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-gold-600 transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                      {related.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default ArticlePage;
