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
import { databaseColorTestService, GroupedTest } from '@/lib/database-color-test-service';
import toast from 'react-hot-toast';

interface TestsManagementProps {
  lang: Language;
}

export function TestsManagement({ lang }: TestsManagementProps) {
  const [tests, setTests] = useState<GroupedTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTestType, setSelectedTestType] = useState<string>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [statistics, setStatistics] = useState({
    total_tests: 0,
    total_results: 0,
    unique_substances: 0,
    unique_colors: 0
  });

  const t = getTranslationsSync(lang);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      // Use the database color test service to get tests from DatabaseColorTest.json
      const groupedTests = await databaseColorTestService.getGroupedTests();
      const stats = await databaseColorTestService.getTestsStatistics();

      setTests(groupedTests);
      setStatistics(stats);

      console.log('✅ Loaded database color tests:', groupedTests.length);
      console.log('📊 Statistics:', stats);

    } catch (error) {
      console.error('Error loading tests:', error);
      toast.error('خطأ في تحميل الاختبارات | Error loading tests');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (testName: string) => {
    setShowDetails(showDetails === testName ? null : testName);
  };

  const handleReloadData = async () => {
    setLoading(true);
    try {
      await databaseColorTestService.reloadData();
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
      test.method_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.method_name_ar.includes(searchQuery) ||
      test.results.some(result =>
        result.possible_substance.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.possible_substance_ar.includes(searchQuery) ||
        result.color_result.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.color_result_ar.includes(searchQuery)
      );

    const matchesTestType = selectedTestType === 'all' || test.test_type === selectedTestType;

    return matchesSearch && matchesTestType;
  });



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
            value={selectedTestType}
            onChange={(e) => setSelectedTestType(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{lang === 'ar' ? 'جميع أنواع الاختبارات' : 'All Test Types'}</option>
            <option value="F/L">{lang === 'ar' ? 'F/L - فلورسنت/ضوئي' : 'F/L - Fluorescent/Light'}</option>
            <option value="L">{lang === 'ar' ? 'L - ضوئي' : 'L - Light'}</option>
            <option value="">{lang === 'ar' ? 'غير محدد' : 'Unspecified'}</option>
          </select>
        </div>
        <div className="relative">
          <SwatchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={selectedTestType}
            onChange={(e) => setSelectedTestType(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{lang === 'ar' ? 'جميع أنواع الاختبارات' : 'All Test Types'}</option>
            <option value="F/L">{lang === 'ar' ? 'F/L - فلورسنت/ضوئي' : 'F/L - Fluorescent/Light'}</option>
            <option value="L">{lang === 'ar' ? 'L - ضوئي' : 'L - Light'}</option>
            <option value="">{lang === 'ar' ? 'غير محدد' : 'Unspecified'}</option>
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
          <p className="text-2xl font-bold text-foreground mt-1">{statistics.total_tests}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <SwatchIcon className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-muted-foreground">
              {lang === 'ar' ? 'إجمالي النتائج' : 'Total Results'}
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{statistics.total_results}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-muted-foreground">
              {lang === 'ar' ? 'المواد الفريدة' : 'Unique Substances'}
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{statistics.unique_substances}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <TagIcon className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-muted-foreground">
              {lang === 'ar' ? 'الألوان الفريدة' : 'Unique Colors'}
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{statistics.unique_colors}</p>
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
                  {lang === 'ar' ? 'نوع الاختبار' : 'Test Type'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {lang === 'ar' ? 'رقم الاختبار' : 'Test Number'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {lang === 'ar' ? 'النتائج' : 'Results'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {lang === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTests.map((test) => (
                <React.Fragment key={test.method_name}>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <BeakerIcon className="h-5 w-5 text-primary-600" />
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {lang === 'ar' ? test.method_name_ar : test.method_name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {test.test_number}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                        test.test_type === 'F/L' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        test.test_type === 'L' ? 'bg-green-100 text-green-800 border-green-200' :
                        'bg-gray-100 text-gray-800 border-gray-200'
                      }`}>
                        {test.test_type || (lang === 'ar' ? 'غير محدد' : 'Unspecified')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-sm font-medium text-foreground">{test.test_number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-sm font-medium text-foreground">{test.total_results}</span>
                        <span className="text-xs text-muted-foreground">
                          {lang === 'ar' ? 'نتيجة' : 'results'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(test.method_name)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>

                  {/* Details Row */}
                  {showDetails === test.method_name && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium text-foreground">
                            {lang === 'ar' ? 'تفاصيل الاختبار:' : 'Test Details:'}
                          </h4>

                          {/* Test Preparation */}
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-border">
                            <h5 className="text-sm font-semibold text-foreground mb-2">
                              {lang === 'ar' ? 'خطوات التحضير:' : 'Preparation Steps:'}
                            </h5>
                            <div className="text-sm text-muted-foreground whitespace-pre-line">
                              {lang === 'ar' ? test.prepare_ar || test.prepare : test.prepare}
                            </div>
                          </div>

                          {/* Test Results */}
                          <div>
                            <h5 className="text-sm font-semibold text-foreground mb-3">
                              {lang === 'ar' ? 'النتائج المحتملة:' : 'Possible Results:'}
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {test.results.map((result, index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-border">
                                  <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                                    <div className="w-4 h-4 rounded-full border border-gray-300 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                                    <span className="text-sm font-medium text-foreground">
                                      {lang === 'ar' ? result.color_result_ar || result.color_result : result.color_result}
                                    </span>
                                  </div>
                                  <div className="text-xs text-muted-foreground mb-1">
                                    {lang === 'ar' ? result.possible_substance_ar || result.possible_substance : result.possible_substance}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Reference */}
                          {test.reference && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                              <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                {lang === 'ar' ? 'المرجع العلمي:' : 'Scientific Reference:'}
                              </h5>
                              <div className="text-sm text-blue-800 dark:text-blue-200 font-mono">
                                {test.reference}
                              </div>
                            </div>
                          )}
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


