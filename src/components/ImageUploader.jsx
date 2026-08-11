import { useState, useRef } from 'react';
import { FaPlus, FaTrash, FaImage } from 'react-icons/fa';

/**
 * مكوّن قابل لإعادة الاستخدام لرفع صور متعددة
 * - يتيح إضافة عدد غير محدود من الصور
 * - معاينة فورية للصور المضافة
 * - حذف أي صورة بشكل منفصل
 */
const ImageUploader = ({ images, onChange, maxImages = 10, label = 'صور المشكلة' }) => {
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    // إضافة ملفات جديدة مع منع التكرار
    const handleFiles = (fileList) => {
        if (!fileList) return;
        const newFiles = Array.from(fileList).filter(
            file => file.type.startsWith('image/')
        );
        const remaining = maxImages - images.length;
        const toAdd = newFiles.slice(0, remaining);
        if (toAdd.length === 0) return;
        onChange([...images, ...toAdd]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // حذف صورة بمعرّفها
    const removeImage = (index) => {
        onChange(images.filter((_, i) => i !== index));
    };

    return (
        <div className="image-uploader">
            <label className="form-label fw-bold mb-2">
                <FaImage className="ms-1" /> {label}
                <span className="text-muted small fw-normal"> ({images.length}/{maxImages})</span>
            </label>

            {/* منطقة المعاينة */}
            {images.length > 0 && (
                <div className="image-uploader-previews">
                    {images.map((img, index) => (
                        <div key={index} className="image-uploader-item">
                            <img
                                src={URL.createObjectURL(img)}
                                alt={`صورة ${index + 1}`}
                                className="image-uploader-thumb"
                            />
                            <button
                                type="button"
                                className="image-uploader-remove"
                                onClick={() => removeImage(index)}
                                title="حذف الصورة"
                            >
                                <FaTrash />
                            </button>
                            <span className="image-uploader-count">{index + 1}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* زر / منطقة إضافة الصور */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="d-flex flex-wrap gap-2 mt-2">
                <button
                    type="button"
                    className="btn image-uploader-add-btn"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={images.length >= maxImages}
                >
                    <FaPlus className="ms-1" /> إضافة صور
                </button>
                <div
                    className={`image-uploader-dropzone ${dragOver ? 'drag-over' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                >
                    أو اسحب وأفلت الصور هنا
                </div>
            </div>
        </div>
    );
};

export default ImageUploader;
