import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Upload, FilePlus, X, Image as ImageIcon } from 'lucide-react';
import { issueService } from '../api/issues';
import { useToast } from '../context/ToastContext';
import { Input, Select, Textarea } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Spinner } from '../components/Loader';
import type { IssueCategory, IssuePriority } from '../types';

interface FormValues {
  title: string;
  description: string;
  category: IssueCategory;
  location: string;
  priority: IssuePriority;
}

export default function ReportIssuePage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const handleImage = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast('Please select an image file', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast('Image must be under 5MB', 'error');
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      await issueService.create({ ...data, image: image || undefined });
      toast('Issue reported successfully!', 'success');
      reset();
      setImage(null);
      setPreview('');
      navigate('/track');
    } catch (e) {
      toast((e as { message: string }).message || 'Failed to submit issue', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Report an Issue</h1>
        <p className="text-sm text-slate-500">Fill in the details below to report a facility issue.</p>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Issue Title"
            placeholder="e.g. Broken classroom window"
            error={errors.title?.message}
            {...register('title', { required: 'Title is required' })}
          />

          <Textarea
            label="Description"
            rows={4}
            placeholder="Describe the issue in detail..."
            error={errors.description?.message}
            {...register('description', { required: 'Description is required' })}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Select label="Category" error={errors.category?.message} {...register('category', { required: 'Category is required' })}>
              <option value="">Select category</option>
              {['Furniture', 'Electrical', 'Plumbing', 'Building', 'Sanitation', 'Playground'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
            <Select label="Priority" error={errors.priority?.message} {...register('priority', { required: 'Priority is required' })}>
              <option value="">Select priority</option>
              {['Low', 'Medium', 'High', 'Emergency'].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Select>
          </div>

          <Input
            label="Location"
            placeholder="e.g. Room 204, Building A"
            error={errors.location?.message}
            {...register('location', { required: 'Location is required' })}
          />

          {/* Image upload */}
          <div>
            <label className="label">Upload Image (optional)</label>
            {preview ? (
              <div className="relative inline-block">
                <img src={preview} alt="preview" className="h-40 w-auto rounded-xl border border-slate-200" />
                <button type="button" onClick={() => { setImage(null); setPreview(''); }} className="absolute -right-2 -top-2 rounded-full bg-error-600 p-1 text-white shadow">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center transition hover:border-primary-400 hover:bg-primary-50">
                <Upload className="mb-2 h-8 w-8 text-slate-400" />
                <p className="text-sm font-medium text-slate-600">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 5MB</p>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e.target.files?.[0])} />
              </label>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? <Spinner /> : <><FilePlus className="h-4 w-4" /> Submit Report</>}
            </Button>
          </div>
        </form>
      </Card>

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
        <ImageIcon className="h-4 w-4" /> Images are uploaded securely via Cloudinary.
      </div>
    </div>
  );
}
