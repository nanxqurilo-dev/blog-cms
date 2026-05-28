"use client"
import React, { useState, useEffect } from 'react';
import { Search, Eye, Code, Globe, FileText, Image, Link2, Twitter, Facebook, Linkedin, AlertCircle, Check, Copy } from 'lucide-react';
import { useParams } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;



type SeoData = {
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  keywords: string[];
  slug: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  robots: string;
  author: string;
  publishDate: string;
};

const BlogPostSEO = () => {

  const params = useParams();
  const postId = params?.id; // ya params.postId

  const [seoData, setSeoData] = useState<SeoData>({
    metaTitle: '',
    metaDescription: '',
    focusKeyword: '',
    keywords: [],
    slug: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    robots: 'index, follow',
    author: '',
    publishDate: new Date().toISOString().split('T')[0]
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [copied, setCopied] = useState(false);
  const [seoScore, setSeoScore] = useState(0);
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const fetchSeoPreview = async () => {
    try {
      const token = localStorage.getItem("cms_token");
      setPreviewLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/api/seo/preview/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch preview");
      }

      setPreviewData(data.data);

    } catch (err: any) {
      console.error(err.message);
    } finally {
      setPreviewLoading(false);
    }
  };



  useEffect(() => {
    if (activeTab === "preview" && postId) {
      fetchSeoPreview();
    }
  }, [activeTab, postId]);


  //new added 

  const saveSeoToBackend = async () => {
    try {
      const token = localStorage.getItem("cms_token");

      const payload = {
        metaTitle: seoData.metaTitle,
        urlSlug: seoData.slug,
        domain: window.location.origin,

        metaDescription: seoData.metaDescription,
        focusKeyword: seoData.focusKeyword,
        additionalKeywords: seoData.keywords,

        canonicalUrl:
          seoData.canonicalUrl ||
          `${window.location.origin}/blog/${seoData.slug}`,

        author: seoData.author,
        publishDate: seoData.publishDate,
        robotsMetaTag: seoData.robots,
        seoScore: seoScore,

        openGraph: {
          ogTitle: seoData.ogTitle || seoData.metaTitle,
          ogDescription:
            seoData.ogDescription || seoData.metaDescription,
          ogImageUrl: seoData.ogImage,
        },

        twitterCard: {
          twitterTitle:
            seoData.twitterTitle ||
            seoData.ogTitle ||
            seoData.metaTitle,

          twitterDescription:
            seoData.twitterDescription ||
            seoData.ogDescription ||
            seoData.metaDescription,

          twitterImageUrl:
            seoData.twitterImage || seoData.ogImage,
        },

        // ✅ dynamic post id
        post: postId,
      };

      console.log("📤 Sending Payload:", payload);


      const res = await fetch(
        `${API_BASE_URL}/api/seo/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      console.log("📡 Response Status:", res.status);


      // if (!res.ok) {
      //   throw new Error(data.message || "Failed to save SEO");
      // }


      if (!res.ok) {
        if (data.message?.toLowerCase().includes("slug")) {
          throw new Error("Slug already exists ⚠️ Try a different one");
        }
        throw new Error(data.message || "Failed to save SEO");
      }



      alert("SEO saved successfully ✅");
    } catch (error: any) {
      alert(error.message);
    }
  };




  // 👇 👇 👇 YAHAN PASTE KARO
  const handleNext = () => {
    if (activeTab === "basic") {
      setActiveTab("social");
    } else if (activeTab === "social") {
      setActiveTab("preview");
    } else if (activeTab === "preview") {
      setActiveTab("code");
    }
  };


  // SEO Score Calculator
  useEffect(() => {
    let score = 0;
    if (seoData.metaTitle.length >= 50 && seoData.metaTitle.length <= 60) score += 20;
    else if (seoData.metaTitle.length > 0) score += 10;

    if (seoData.metaDescription.length >= 150 && seoData.metaDescription.length <= 160) score += 20;
    else if (seoData.metaDescription.length > 0) score += 10;

    if (seoData.focusKeyword) score += 15;
    if (seoData.keywords.length >= 3) score += 15;
    if (seoData.slug) score += 10;
    if (seoData.ogImage) score += 10;
    if (seoData.canonicalUrl) score += 10;

    setSeoScore(score);
  }, [seoData]);


  useEffect(() => {
    if (seoData.metaTitle && !seoData.slug) {
      const slug = seoData.metaTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      setSeoData(prev => ({ ...prev, slug }));
    }
  }, [seoData.metaTitle]);



  const handleInputChange = (field: keyof SeoData, value: string) => {
    setSeoData(prev => ({ ...prev, [field]: value }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !seoData.keywords.includes(keywordInput.trim())) {
      setSeoData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setSeoData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  // const generateSlugFromTitle = () => {
  //   const slug = seoData.metaTitle
  //     .toLowerCase()
  //     .replace(/[^a-z0-9]+/g, '-')
  //     .replace(/^-|-$/g, '');
  //   handleInputChange('slug', slug);
  // };



  const generateSlugFromTitle = () => {
    const baseSlug = seoData.metaTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // 🔥 random suffix add karo
    const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    handleInputChange('slug', uniqueSlug);
  };



  const copyMetaTags = () => {
    const metaTags = generateMetaTags();
    navigator.clipboard.writeText(metaTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateMetaTags = () => {
    return `{/* Basic SEO */}
<title>${seoData.metaTitle}</title>
<meta name="description" content="${seoData.metaDescription}" />
<meta name="keywords" content="${seoData.keywords.join(', ')}" />
<meta name="author" content="${seoData.author}" />
<meta name="robots" content="${seoData.robots}" />
${seoData.canonicalUrl ? `<link rel="canonical" href="${seoData.canonicalUrl}" />` : ''}

{/* Open Graph / Facebook */}
<meta property="og:type" content="article" />
<meta property="og:title" content="${seoData.ogTitle || seoData.metaTitle}" />
<meta property="og:description" content="${seoData.ogDescription || seoData.metaDescription}" />
${seoData.ogImage ? `<meta property="og:image" content="${seoData.ogImage}" />` : ''}
<meta property="article:published_time" content="${seoData.publishDate}" />
<meta property="article:author" content="${seoData.author}" />

{/* Twitter Card */}
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${seoData.twitterTitle || seoData.ogTitle || seoData.metaTitle}" />
<meta name="twitter:description" content="${seoData.twitterDescription || seoData.ogDescription || seoData.metaDescription}" />
${seoData.twitterImage || seoData.ogImage ? `<meta name="twitter:image" content="${seoData.twitterImage || seoData.ogImage}" />` : ''}`;
  };

  const getSeoScoreColor = () => {
    if (seoScore >= 80) return 'text-green-600';
    if (seoScore >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeoScoreBg = () => {
    if (seoScore >= 80) return 'bg-green-100';
    if (seoScore >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Post SEO Settings</h1>
              <p className="text-gray-600">Configure SEO metadata for your blog post</p>
            </div>
            <div className={`${getSeoScoreBg()} rounded-lg p-4 text-center min-w-[120px]`}>
              <div className={`text-3xl font-bold ${getSeoScoreColor()}`}>{seoScore}</div>
              <div className="text-sm text-gray-600 font-medium">SEO Score</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-lg shadow-sm border border-b-0 border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('basic')}
              className={`flex items-center px-6 py-4 font-medium text-sm transition-colors border-b-2 ${activeTab === 'basic'
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Basic SEO
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`flex items-center px-6 py-4 font-medium text-sm transition-colors border-b-2 ${activeTab === 'social'
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              <Globe className="w-4 h-4 mr-2" />
              Social Media
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center px-6 py-4 font-medium text-sm transition-colors border-b-2 ${activeTab === 'preview'
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center px-6 py-4 font-medium text-sm transition-colors border-b-2 ${activeTab === 'code'
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              <Code className="w-4 h-4 mr-2" />
              Code
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-b-lg shadow-sm border border-gray-200 p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Meta Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Meta Title *
                </label>
                <input
                  type="text"
                  value={seoData.metaTitle}
                  onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                  placeholder="Enter your blog post title (50-60 characters)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className={`text-sm ${seoData.metaTitle.length >= 50 && seoData.metaTitle.length <= 60 ? 'text-green-600' : 'text-gray-500'}`}>
                    {seoData.metaTitle.length} characters {seoData.metaTitle.length >= 50 && seoData.metaTitle.length <= 60 && '✓ Perfect length'}
                  </p>
                </div>
              </div>

              {/* URL Slug */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL Slug *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={seoData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="blog-post-url-slug"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={generateSlugFromTitle}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Generate
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  URL: yourdomain.com/blog/{seoData.slug || 'your-slug'}
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Meta Description *
                </label>
                <textarea
                  value={seoData.metaDescription}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                  placeholder="Write a compelling description for search engines (150-160 characters)"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className={`text-sm mt-2 ${seoData.metaDescription.length >= 150 && seoData.metaDescription.length <= 160 ? 'text-green-600' : 'text-gray-500'}`}>
                  {seoData.metaDescription.length} characters {seoData.metaDescription.length >= 150 && seoData.metaDescription.length <= 160 && '✓ Perfect length'}
                </p>
              </div>

              {/* Focus Keyword */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Focus Keyword
                </label>
                <input
                  type="text"
                  value={seoData.focusKeyword}
                  onChange={(e) => handleInputChange('focusKeyword', e.target.value)}
                  placeholder="Main keyword for this blog post"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Primary keyword you want to rank for
                </p>
              </div>

              {/* Additional Keywords */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Keywords
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    placeholder="Add keyword and press Enter"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={addKeyword}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {seoData.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Canonical URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Canonical URL
                </label>
                <input
                  type="text"
                  value={seoData.canonicalUrl}
                  onChange={(e) => handleInputChange('canonicalUrl', e.target.value)}
                  placeholder="https://yourdomain.com/blog/your-post"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Author and Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={seoData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    placeholder="Author name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    value={seoData.publishDate}
                    onChange={(e) => handleInputChange('publishDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Robots */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Robots Meta Tag
                </label>
                <select
                  value={seoData.robots}
                  onChange={(e) => handleInputChange('robots', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="index, follow">Index, Follow (Default)</option>
                  <option value="noindex, follow">No Index, Follow</option>
                  <option value="index, nofollow">Index, No Follow</option>
                  <option value="noindex, nofollow">No Index, No Follow</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-8">
              {/* Open Graph / Facebook */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Facebook className="w-5 h-5 mr-2 text-blue-600" />
                  Facebook / Open Graph
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      OG Title
                    </label>
                    <input
                      type="text"
                      value={seoData.ogTitle}
                      onChange={(e) => handleInputChange('ogTitle', e.target.value)}
                      placeholder="Leave blank to use Meta Title"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      OG Description
                    </label>
                    <textarea
                      value={seoData.ogDescription}
                      onChange={(e) => handleInputChange('ogDescription', e.target.value)}
                      placeholder="Leave blank to use Meta Description"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      OG Image URL
                    </label>
                    <input
                      type="text"
                      value={seoData.ogImage}
                      onChange={(e) => handleInputChange('ogImage', e.target.value)}
                      placeholder="https://yourdomain.com/images/og-image.jpg"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Recommended: 1200x630px
                    </p>
                  </div>
                </div>
              </div>

              {/* Twitter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Twitter className="w-5 h-5 mr-2 text-blue-400" />
                  Twitter Card
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Twitter Title
                    </label>
                    <input
                      type="text"
                      value={seoData.twitterTitle}
                      onChange={(e) => handleInputChange('twitterTitle', e.target.value)}
                      placeholder="Leave blank to use OG Title"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Twitter Description
                    </label>
                    <textarea
                      value={seoData.twitterDescription}
                      onChange={(e) => handleInputChange('twitterDescription', e.target.value)}
                      placeholder="Leave blank to use OG Description"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Twitter Image URL
                    </label>
                    <input
                      type="text"
                      value={seoData.twitterImage}
                      onChange={(e) => handleInputChange('twitterImage', e.target.value)}
                      placeholder="Leave blank to use OG Image"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-6">
              {/* Google Preview */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Search className="w-5 h-5 mr-2 text-blue-600" />
                  Google Search Result
                </h3>
                <div className="border border-gray-300 rounded-lg p-6 bg-white">
                  <div className="text-sm text-gray-600 mb-1">
                    {previewData?.domain || 'yourdomain.com'} › blog › {previewData?.urlSlug || seoData.slug || 'post-url'}
                  </div>

                  <div className="text-xl text-blue-700 hover:underline cursor-pointer mb-2">
                    {previewData?.metaTitle || seoData.metaTitle || 'Your Blog Post Title'}
                  </div>

                  <div className="text-sm text-gray-700 leading-relaxed">
                    {previewData?.metaDescription || seoData.metaDescription || 'Your meta description will appear here'}
                  </div>
                </div>
              </div>

              {/* Facebook Preview */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Facebook className="w-5 h-5 mr-2 text-blue-600" />
                  Facebook / LinkedIn Share
                </h3>
                <div className="border border-gray-300 rounded-lg overflow-hidden bg-white max-w-xl">
                  {(previewData?.openGraph?.ogImageUrl || seoData.ogImage) && (
                    <div className="bg-gray-200 h-64 flex items-center justify-center">
                      <Image className="w-16 h-16 text-gray-400" />
                    </div>
                  )}

                  <div className="p-4">
                    <div className="text-xs text-gray-500 uppercase mb-2">
                      {previewData?.domain || 'yourdomain.com'}
                    </div>

                    <div className="text-lg font-semibold text-gray-900 mb-1">
                      {previewData?.openGraph?.ogTitle || seoData.ogTitle || seoData.metaTitle}
                    </div>

                    <div className="text-sm text-gray-600">
                      {previewData?.openGraph?.ogDescription || seoData.ogDescription || seoData.metaDescription}
                    </div>

                  </div>
                </div>
              </div>

              {/* Twitter Preview */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Twitter className="w-5 h-5 mr-2 text-blue-400" />
                  Twitter Card
                </h3>
                <div className="border border-gray-300 rounded-2xl overflow-hidden bg-white max-w-xl">
                  {(seoData.twitterImage || seoData.ogImage) && (
                    <div className="bg-gray-200 h-64 flex items-center justify-center">
                      <Image className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  {/* <div className="p-4">
                    <div className="text-base font-semibold text-gray-900 mb-1">
                      {seoData.twitterTitle || seoData.ogTitle || seoData.metaTitle || 'Your Blog Post Title'}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {seoData.twitterDescription || seoData.ogDescription || seoData.metaDescription || 'Your description...'}
                    </div>
                    <div className="text-xs text-gray-500">
                      yourdomain.com
                    </div>
                  </div> */}




                  <div className="p-4">
                    <div className="text-base font-semibold text-gray-900 mb-1">
                      {previewData?.twitterCard?.twitterTitle || seoData.twitterTitle || seoData.metaTitle}
                    </div>

                    <div className="text-sm text-gray-600 mb-2">
                      {previewData?.twitterCard?.twitterDescription || seoData.twitterDescription || seoData.metaDescription}
                    </div>

                    <div className="text-xs text-gray-500">
                      {previewData?.domain || 'yourdomain.com'}
                    </div>
                  </div>


                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Generated Meta Tags</h3>
                <button
                  onClick={copyMetaTags}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto text-sm">
                {/* <code>{generateMetaTags()}</code> */}

                <code>{previewData?.generatedCode || generateMetaTags()}</code>

              </pre>
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Next.js Integration:</strong> Copy these meta tags and paste them in your page's <code className="bg-blue-100 px-2 py-1 rounded">{'<Head>'}</code> component or use them in your metadata export.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        {/* <div className="mt-6 flex justify-end">
          <button
           

onClick={saveSeoToBackend}


            className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg shadow-lg"
          >
            Save SEO Settings
          </button>
        </div> */}


        <div className="mt-6 flex justify-end gap-4">

          {/* Back button */}
          {activeTab !== "basic" && (
            <button
              onClick={() => {
                if (activeTab === "social") setActiveTab("basic");
                else if (activeTab === "preview") setActiveTab("social");
                else if (activeTab === "code") setActiveTab("preview");
              }}
              className="px-6 py-3 bg-gray-200 rounded-lg"
            >
              Back
            </button>
          )}

          {/* Next OR Save */}
          {activeTab !== "code" ? (
            <button
              onClick={handleNext}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={saveSeoToBackend}
              className="px-8 py-4 bg-green-600 text-white rounded-lg"
            >
              Save SEO Settings
            </button>
          )}

        </div>


      </div>
    </div>
  );
};

export default BlogPostSEO;
