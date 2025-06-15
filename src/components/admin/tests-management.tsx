'use client';

import React, { useState, useEffect } from 'react';
import { Language } from '@/types';
import { getTranslationsSync } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  BeakerIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  TagIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  SwatchIcon
} from '@heroicons/react/24/outline';
import { testDataExtractor, ExtractedTest } from '@/lib/test-data-extractor';
import toast from 'react-hot-toast';

interface TestsManagementProps {
  lang: Language;
}

export function TestsManagement({ lang }: TestsManagementProps) {
  const [tests, setTests] = useState<ExtractedTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedConfidence, setSelectedConfidence] = useState<string>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [statistics, setStatistics] = useState({
    total: 0,
    basic: 0,
    advanced: 0,
    specialized: 0,
    totalResults: 0,
    highConfidenceResults: 0
  });

  const t = getTranslationsSync(lang);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      // Use the test data extractor to get tests from color results
      const extractedTests = await testDataExtractor.getExtractedTests();
      const stats = await testDataExtractor.getTestsStatistics();

      setTests(extractedTests);
      setStatistics(stats);

      console.log('✅ Loaded extracted tests:', extractedTests.length);
      console.log('📊 Statistics:', stats);

    } catch (error) {
      console.error('Error loading tests:', error);
      toast.error('خطأ في تحميل الاختبارات | Error loading tests');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (testId: string) => {
    setShowDetails(showDetails === testId ? null : testId);
  };

  const handleReloadData = async () => {
    setLoading(true);
    try {
      await testDataExtractor.reloadData();
      await loadTests();
      toast.success(lang === 'ar' ? 'تم تحديث البيانات' : 'Data refreshed');
    } catch (error) {
      console.error('Error reloading data:', error);
      toast.error(lang === 'ar' ? 'خطأ في تحديث البيانات' : 'Error refreshing data');
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = searchQuery === '' ||
      test.test_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.test_name_ar.includes(searchQuery) ||
      test.test_id.includes(searchQuery.toLowerCase()) ||
      test.color_results.some(result =>
        result.possible_substance.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.possible_substance_ar.includes(searchQuery)
      );

    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;

    const matchesConfidence = selectedConfidence === 'all' ||
      test.color_results.some(result => result.confidence_level === selectedConfidence);

    return matchesSearch && matchesCategory && matchesConfidence;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'advanced': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'specialized': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getConfidenceLevelColor = (level: string) => {
    switch (level) {
      case 'very_high': return 'text-green-700 bg-green-100 border-green-300';
      case 'high': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryName = (category: string) => {
    const names = {
      basic: lang === 'ar' ? 'أساسي' : 'Basic',
      advanced: lang === 'ar' ? 'متقدم' : 'Advanced',
      specialized: lang === 'ar' ? 'متخصص' : 'Specialized'
    };
    return names[category as keyof typeof names] || category;
  };

  const getConfidenceName = (level: string) => {
    const names = {
      very_high: lang === 'ar' ? 'عالي جداً' : 'Very High',
      high: lang === 'ar' ? 'عالي' : 'High',
      medium: lang === 'ar' ? 'متوسط' : 'Medium',
      low: lang === 'ar' ? 'منخفض' : 'Low'
    };
    return names[level as keyof typeof names] || level;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {lang === 'ar' ? 'إدارة الاختبارات الكيميائية' : 'Chemical Tests Management'}
          </h2>
          <p className="text-muted-foreground">
            {lang === 'ar'
              ? 'عرض وإدارة الاختبارات المستخرجة من النتائج اللونية'
              : 'View and manage tests extracted from color results'
            }
          </p>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button
            onClick={handleReloadData}
            variant="outline"
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <ChartBarIcon className="h-4 w-4" />
            <span>{lang === 'ar' ? 'تحديث البيانات' : 'Refresh Data'}</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={lang === 'ar' ? 'البحث في الاختبارات والمواد...' : 'Search tests and substances...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{lang === 'ar' ? 'جميع الفئات' : 'All Categories'}</option>
            <option value="basic">{lang === 'ar' ? 'أساسي' : 'Basic'}</option>
            <option value="advanced">{lang === 'ar' ? 'متقدم' : 'Advanced'}</option>
            <option value="specialized">{lang === 'ar' ? 'متخصص' : 'Specialized'}</option>
          </select>
        </div>
        <div className="relative">
          <SwatchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={selectedConfidence}
            onChange={(e) => setSelectedConfidence(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{lang === 'ar' ? 'جميع مستويات الثقة' : 'All Confidence Levels'}</option>
            <option value="very_high">{lang === 'ar' ? 'عالي جداً' : 'Very High'}</option>
            <option value="high">{lang === 'ar' ? 'عالي' : 'High'}</option>
            <option value="medium">{lang === 'ar' ? 'متوسط' : 'Medium'}</option>
            <option value="low">{lang === 'ar' ? 'منخفض' : 'Low'}</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <BeakerIcon className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-medium text-muted-foreground">
              {lang === 'ar' ? 'إجمالي الاختبارات' : 'Total Tests'}
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{statistics.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <SwatchIcon className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-muted-foreground">
              {lang === 'ar' ? 'إجمالي النتائج' : 'Total Results'}
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{statistics.totalResults}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-muted-foreground">
              {lang === 'ar' ? 'ثقة عالية' : 'High Confidence'}
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{statistics.highConfidenceResults}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <TagIcon className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-muted-foreground">
              {lang === 'ar' ? 'متخصصة' : 'Specialized'}
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{statistics.specialized}</p>
        </div>
      </div>

      {/* Tests Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {lang === 'ar' ? 'الاختبار' : 'Test'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {lang === 'ar' ? 'الفئة' : 'Category'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {lang === 'ar' ? 'النتائج' : 'Results'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {lang === 'ar' ? 'الثقة العالية' : 'High Confidence'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {lang === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTests.map((test) => (
                <React.Fragment key={test.test_id}>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <BeakerIcon className="h-5 w-5 text-primary-600" />
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {lang === 'ar' ? test.test_name_ar : test.test_name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {test.test_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getCategoryColor(test.category)}`}>
                        {getCategoryName(test.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-sm font-medium text-foreground">{test.total_results}</span>
                        <span className="text-xs text-muted-foreground">
                          {lang === 'ar' ? 'نتيجة' : 'results'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium text-foreground">{test.high_confidence_results}</span>
                        <span className="text-xs text-muted-foreground">
                          / {test.total_results}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(test.test_id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>

                  {/* Details Row */}
                  {showDetails === test.test_id && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium text-foreground">
                            {lang === 'ar' ? 'النتائج اللونية:' : 'Color Results:'}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {test.color_results.map((result, index) => (
                              <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-border">
                                <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                                  <div
                                    className="w-4 h-4 rounded-full border border-gray-300"
                                    style={{ backgroundColor: result.color_hex }}
                                  ></div>
                                  <span className="text-sm font-medium text-foreground">
                                    {lang === 'ar' ? result.color_result_ar : result.color_result}
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground mb-1">
                                  {lang === 'ar' ? result.possible_substance_ar : result.possible_substance}
                                </div>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getConfidenceLevelColor(result.confidence_level)}`}>
                                  {getConfidenceName(result.confidence_level)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredTests.length === 0 && !loading && (
        <div className="text-center py-12">
          <BeakerIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            {lang === 'ar' ? 'لا توجد اختبارات' : 'No tests found'}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {lang === 'ar'
              ? 'لم يتم العثور على اختبارات تطابق معايير البحث'
              : 'No tests match the search criteria'
            }
          </p>
        </div>
      )}
    </div>
  );
}


