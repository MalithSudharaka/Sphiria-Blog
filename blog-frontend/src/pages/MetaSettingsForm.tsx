import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

const metaSettingsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  metaKeyword: z.string().min(1, 'Meta keyword is required'),
  metaDescription: z.string().min(1, 'Meta description is required'),
  googleAnalyticsId: z.string().min(1, 'Google Analytics ID is required'),
  defaultImage: z.string().optional(),
});

type MetaSettingsFormData = z.infer<typeof metaSettingsSchema>;

const MetaSettingsForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MetaSettingsFormData>({
    resolver: zodResolver(metaSettingsSchema),
  });

  const onSubmit = async (data: MetaSettingsFormData) => {
    try {
      await axios.put('http://localhost:5000/meta-settings', data);
      alert('Settings updated successfully!');
    } catch (error) {
      alert('Failed to update settings');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-6">Meta Settings</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            {...register('title')}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Meta Keyword</label>
          <textarea
            {...register('metaKeyword')}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter meta keywords"
          />
          {errors.metaKeyword && <p className="text-red-500 text-sm mt-1">{errors.metaKeyword.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Meta Description</label>
          <textarea
            {...register('metaDescription')}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter meta description"
          />
          {errors.metaDescription && <p className="text-red-500 text-sm mt-1">{errors.metaDescription.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Google Analytics ID</label>
          <input
            {...register('googleAnalyticsId')}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter Google Analytics ID"
          />
          {errors.googleAnalyticsId && <p className="text-red-500 text-sm mt-1">{errors.googleAnalyticsId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Default Image URL</label>
          <input
            {...register('defaultImage')}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter default image URL"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default MetaSettingsForm;
