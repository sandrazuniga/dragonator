import React, { useState, useCallback } from 'react';
import { analyzeImage } from '../services/geminiService';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-3xl md:text-4xl font-black text-brand-red uppercase tracking-wide mb-8 text-center">{children}</h2>
);

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // Remove the data:mime/type;base64, part
    };
    reader.onerror = (error) => reject(error);
  });
};

const ImageAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImage(URL.createObjectURL(file));
      setAnalysis('');
      setError('');
    }
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!imageFile) {
      setError('Please, select an image first.');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis('');

    try {
      const base64Image = await fileToBase64(imageFile);
      const result = await analyzeImage(base64Image, imageFile.type);
      setAnalysis(result);
    } catch (err) {
      setError('An error occurred while analyzing the image.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [imageFile]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionTitle>Fan Zone: Photo Analyzer</SectionTitle>
      <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
        Have an epic concert photo or incredible fan art? Upload it here and let our AI, with all the spirit of rock, tell you how awesome it is.
      </p>
      <div className="max-w-xl mx-auto bg-white dark:bg-brand-gray p-8 rounded-lg shadow-lg">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-lg p-6 text-center">
            <input type="file" id="imageUpload" accept="image/*" onChange={handleImageChange} className="hidden" />
            <label htmlFor="imageUpload" className="cursor-pointer bg-brand-red text-white px-6 py-2 rounded-md font-bold hover:bg-red-700 transition-colors">
                Select Image
            </label>
            {image && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{imageFile?.name}</p>}
        </div>

        {image && (
          <div className="mt-6">
            <img src={image} alt="Preview" className="max-w-full h-auto mx-auto rounded-lg shadow-md" />
          </div>
        )}
        
        <div className="mt-6 text-center">
            <button
                onClick={handleAnalyzeClick}
                disabled={!image || loading}
                className="w-full bg-brand-red text-white py-3 rounded-md font-bold text-lg disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
            >
                {loading ? 'Analyzing...' : 'Analyze with Rock Spirit!'}
            </button>
        </div>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        
        {analysis && (
            <div className="mt-8 p-4 bg-gray-100 dark:bg-brand-black rounded-lg animate-fade-in">
                <h3 className="text-xl font-bold text-brand-red mb-2">AI Analysis:</h3>
                <p className="text-gray-800 dark:text-white whitespace-pre-wrap">{analysis}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ImageAnalyzer;