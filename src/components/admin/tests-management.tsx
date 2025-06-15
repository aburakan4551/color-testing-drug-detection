'use client';

import { useState, useEffect } from 'react';
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
  TagIcon
} from '@heroicons/react/24/outline';
import { adminDataService } from '@/lib/admin-data-service';
import toast from 'react-hot-toast';

interface ChemicalTest {
  id: string;
  method_name: string;
  method_name_ar: string;
  description: string;
  description_ar: string;
  category: string;
  safety_level: string;
  preparation_time: number;
  icon: string;
  color_primary: string;
  created_at: string;
  prepare?: string;
  prepare_ar?: string;
  test_type?: string;
  test_number?: string;
  reference?: string;
}

interface TestsManagementProps {
  lang: Language;
}

export function TestsManagement({ lang }: TestsManagementProps) {
  const [tests, setTests] = useState<ChemicalTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTest, setEditingTest] = useState<ChemicalTest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSafetyLevel, setSelectedSafetyLevel] = useState<string>('all');

  const t = getTranslationsSync(lang);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      // Use the enhanced admin data service
      const tests = await adminDataService.getChemicalTests();
      setTests(tests);

      console.log('✅ Loaded tests:', tests.length);

    } catch (error) {
      console.error('Error loading tests:', error);
      toast.error('خطأ في تحميل الاختبارات | Error loading tests');
    } finally {
      setLoading(false);
    }
  };

  const saveTests = (updatedTests: ChemicalTest[]) => {
    setTests(updatedTests);
    localStorage.setItem('chemical_tests_admin', JSON.stringify(updatedTests));
  };

  const handleAddTest = () => {
    setEditingTest(null);
    setShowModal(true);
  };

  const handleEditTest = (test: ChemicalTest) => {
    setEditingTest(test);
    setShowModal(true);
  };

  const handleDeleteTest = (testId: string) => {
    if (confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا الاختبار؟' : 'Are you sure you want to delete this test?')) {
      const updatedTests = tests.filter(test => test.id !== testId);
      saveTests(updatedTests);
    }
  };

  const handleSaveTest = (testData: ChemicalTest) => {
    let updatedTests;
    if (editingTest) {
      // Update existing test
      updatedTests = tests.map(test => 
        test.id === editingTest.id ? testData : test
      );
    } else {
      // Add new test
      updatedTests = [...tests, testData];
    }
    saveTests(updatedTests);
    setShowModal(false);
    setEditingTest(null);
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = searchQuery === '' || 
      test.method_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.method_name_ar.includes(searchQuery) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description_ar.includes(searchQuery);
    
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    const matchesSafety = selectedSafetyLevel === 'all' || test.safety_level === selectedSafetyLevel;
    
    return matchesSearch && matchesCategory && matchesSafety;
  });

  const getSafetyLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'extreme': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'advanced': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'specialized': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
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
            {lang === 'ar' ? 'إدارة الاختبارات' : 'Tests Management'}
          </h2>
          <p className="text-muted-foreground">
            {lang === 'ar' 
              ? 'إدارة وتحرير الاختبارات الكيميائية'
              : 'Manage and edit chemical tests'
            }
          </p>
        </div>
        <Button onClick={handleAddTest} className="flex items-center space-x-2 rtl:space-x-reverse">
          <PlusIcon className="h-4 w-4" />
          <span>{lang === 'ar' ? 'إضافة اختبار جديد' : 'Add New Test'}</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <input
            type="text"
            placeholder={lang === 'ar' ? 'البحث في الاختبارات...' : 'Search tests...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{lang === 'ar' ? 'جميع الفئات' : 'All Categories'}</option>
            <option value="basic">{lang === 'ar' ? 'أساسي' : 'Basic'}</option>
            <option value="advanced">{lang === 'ar' ? 'متقدم' : 'Advanced'}</option>
            <option value="specialized">{lang === 'ar' ? 'متخصص' : 'Specialized'}</option>
          </select>
        </div>
        <div>
          <select
            value={selectedSafetyLevel}
            onChange={(e) => setSelectedSafetyLevel(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{lang === 'ar' ? 'جميع مستويات الأمان' : 'All Safety Levels'}</option>
            <option value="low">{lang === 'ar' ? 'منخفض' : 'Low'}</option>
            <option value="medium">{lang === 'ar' ? 'متوسط' : 'Medium'}</option>
            <option value="high">{lang === 'ar' ? 'عالي' : 'High'}</option>
            <option value="extreme">{lang === 'ar' ? 'خطر شديد' : 'Extreme'}</option>
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
          <p className="text-2xl font-bold text-foreground mt-1">{tests.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <TagIcon className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-muted-foreground">
              {lang === 'ar' ? 'الأساسية' : 'Basic'}
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">
            {tests.filter(t => t.category === 'basic').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <TagIcon className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-muted-foreground">
              {lang === 'ar' ? 'المتقدمة' : 'Advanced'}
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">
            {tests.filter(t => t.category === 'advanced').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-border">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-muted-foreground">
              {lang === 'ar' ? 'خطر شديد' : 'Extreme Risk'}
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">
            {tests.filter(t => t.safety_level === 'extreme').length}
          </p>
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
                  {lang === 'ar' ? 'مستوى الأمان' : 'Safety Level'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {lang === 'ar' ? 'وقت التحضير' : 'Prep Time'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {lang === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTests.map((test) => (
                <tr key={test.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: test.color_primary }}
                      ></div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {lang === 'ar' ? test.method_name_ar : test.method_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {lang === 'ar' ? test.description_ar : test.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getCategoryColor(test.category)}`}>
                      {lang === 'ar' 
                        ? (test.category === 'basic' ? 'أساسي' : test.category === 'advanced' ? 'متقدم' : 'متخصص')
                        : test.category
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSafetyLevelColor(test.safety_level)}`}>
                      {lang === 'ar' 
                        ? (test.safety_level === 'low' ? 'منخفض' : 
                           test.safety_level === 'medium' ? 'متوسط' : 
                           test.safety_level === 'high' ? 'عالي' : 'خطر شديد')
                        : test.safety_level
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1 rtl:space-x-reverse text-sm text-muted-foreground">
                      <ClockIcon className="h-4 w-4" />
                      <span>{test.preparation_time} {lang === 'ar' ? 'دقيقة' : 'min'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTest(test)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTest(test.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Test Modal */}
      {showModal && (
        <TestModal
          lang={lang}
          test={editingTest}
          onSave={handleSaveTest}
          onClose={() => {
            setShowModal(false);
            setEditingTest(null);
          }}
        />
      )}
    </div>
  );
}

// Test Modal Component
interface TestModalProps {
  lang: Language;
  test: ChemicalTest | null;
  onSave: (test: ChemicalTest) => void;
  onClose: () => void;
}

function TestModal({ lang, test, onSave, onClose }: TestModalProps) {
  const [formData, setFormData] = useState<ChemicalTest>({
    id: test?.id || '',
    method_name: test?.method_name || '',
    method_name_ar: test?.method_name_ar || '',
    description: test?.description || '',
    description_ar: test?.description_ar || '',
    category: test?.category || 'basic',
    safety_level: test?.safety_level || 'medium',
    preparation_time: test?.preparation_time || 5,
    icon: test?.icon || 'BeakerIcon',
    color_primary: test?.color_primary || '#8B5CF6',
    created_at: test?.created_at || new Date().toISOString(),
    prepare: test?.prepare || '',
    prepare_ar: test?.prepare_ar || '',
    test_type: test?.test_type || '',
    test_number: test?.test_number || '',
    reference: test?.reference || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'preparation_time' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate ID if new test
    if (!test) {
      const id = formData.method_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-test';
      formData.id = id;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              {test
                ? (lang === 'ar' ? 'تحرير الاختبار' : 'Edit Test')
                : (lang === 'ar' ? 'إضافة اختبار جديد' : 'Add New Test')
              }
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {lang === 'ar' ? 'اسم الاختبار (إنجليزي)' : 'Test Name (English)'}
                </label>
                <input
                  type="text"
                  name="method_name"
                  value={formData.method_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {lang === 'ar' ? 'اسم الاختبار (عربي)' : 'Test Name (Arabic)'}
                </label>
                <input
                  type="text"
                  name="method_name_ar"
                  value={formData.method_name_ar}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {lang === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {lang === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}
                </label>
                <textarea
                  name="description_ar"
                  value={formData.description_ar}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Category and Safety */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {lang === 'ar' ? 'الفئة' : 'Category'}
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="basic">{lang === 'ar' ? 'أساسي' : 'Basic'}</option>
                  <option value="advanced">{lang === 'ar' ? 'متقدم' : 'Advanced'}</option>
                  <option value="specialized">{lang === 'ar' ? 'متخصص' : 'Specialized'}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {lang === 'ar' ? 'مستوى الأمان' : 'Safety Level'}
                </label>
                <select
                  name="safety_level"
                  value={formData.safety_level}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="low">{lang === 'ar' ? 'منخفض' : 'Low'}</option>
                  <option value="medium">{lang === 'ar' ? 'متوسط' : 'Medium'}</option>
                  <option value="high">{lang === 'ar' ? 'عالي' : 'High'}</option>
                  <option value="extreme">{lang === 'ar' ? 'خطر شديد' : 'Extreme'}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {lang === 'ar' ? 'وقت التحضير (دقيقة)' : 'Preparation Time (minutes)'}
                </label>
                <input
                  type="number"
                  name="preparation_time"
                  value={formData.preparation_time}
                  onChange={handleInputChange}
                  min="1"
                  max="60"
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Color and Icon */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {lang === 'ar' ? 'اللون الأساسي' : 'Primary Color'}
                </label>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <input
                    type="color"
                    name="color_primary"
                    value={formData.color_primary}
                    onChange={handleInputChange}
                    className="w-12 h-10 border border-border rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    name="color_primary"
                    value={formData.color_primary}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {lang === 'ar' ? 'الأيقونة' : 'Icon'}
                </label>
                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="BeakerIcon">BeakerIcon</option>
                  <option value="ExclamationTriangleIcon">ExclamationTriangleIcon</option>
                </select>
              </div>
            </div>

            {/* Preparation Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {lang === 'ar' ? 'طريقة التحضير (إنجليزي)' : 'Preparation Method (English)'}
                </label>
                <textarea
                  name="prepare"
                  value={formData.prepare}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="1. Step one...\n2. Step two..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {lang === 'ar' ? 'طريقة التحضير (عربي)' : 'Preparation Method (Arabic)'}
                </label>
                <textarea
                  name="prepare_ar"
                  value={formData.prepare_ar}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="1. الخطوة الأولى...\n2. الخطوة الثانية..."
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {lang === 'ar' ? 'نوع الاختبار' : 'Test Type'}
                </label>
                <input
                  type="text"
                  name="test_type"
                  value={formData.test_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="F/L, L, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {lang === 'ar' ? 'رقم الاختبار' : 'Test Number'}
                </label>
                <input
                  type="text"
                  name="test_number"
                  value={formData.test_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Test 1, Test 21, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {lang === 'ar' ? 'المرجع' : 'Reference'}
                </label>
                <input
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Author, Journal, Year..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button type="submit">
                {test
                  ? (lang === 'ar' ? 'تحديث الاختبار' : 'Update Test')
                  : (lang === 'ar' ? 'إضافة الاختبار' : 'Add Test')
                }
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
