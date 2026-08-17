import { useState, useRef } from 'react';
import { FaTrash, FaFileAlt, FaCloudUploadAlt } from 'react-icons/fa';

/**
 * مكوّن قابل لإعادة الاستخدام لرفع ملفات وصور متعددة
 * - منطقة سحب وإفلات عريضة
 * - يقبل الصور والملفات معاً
 * - معاينة الصور أو عرض اسم المستند
 */
const ImageUploader = ({ images, onChange, maxImages = 10, label = 'المرفقات (صور أو مستندات)' }) => {
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    // إضافة ملفات أو صور جديدة
    const handleFiles = (fileList) => {
        if (!fileList) return;
        
        // تحويل القائمة إلى مصفوفة (تم إزالة فلتر الصور فقط ليقبل الملفات أيضاً)
        const newFiles = Array.from(fileList);
        
        const remaining = maxImages - images.length;
        const toAdd = newFiles.slice(0, remaining);
        
        if (toAdd.length === 0) return;
        
        onChange([...images, ...toAdd]);
        
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // حذف مرفق بمعرّفه
    const removeImage = (index) => {
        onChange(images.filter((_, i) => i !== index));
    };

    return (
        <div className="w-100">
            <label className="form-label fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#1b2a47', fontSize: '18px' }}>
                <FaCloudUploadAlt className="text-primary" size={24} /> 
                {label}
                <span className="text-muted small fw-normal">({images.length}/{maxImages})</span>
            </label>

            {/* منطقة السحب والإفلات العريضة (Drag & Drop Zone) */}
            <div 
                className={`p-4 p-md-5 text-center mb-4 rounded-4 transition-all ${dragOver ? 'bg-primary bg-opacity-10 border-primary' : 'bg-light'}`}
                style={{ 
                    border: `2px dashed ${dragOver ? '#0d6efd' : '#cbd5e1'}`, 
                    cursor: 'pointer' 
                }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
            >
                <div className="bg-white text-primary p-3 rounded-circle d-inline-flex shadow-sm mb-3">
                    <FaCloudUploadAlt size={35} />
                </div>
                <h5 className="fw-bold" style={{ color: '#1b2a47' }}>اسحب وأفلت الملفات والصور هنا</h5>
                <p className="text-muted mb-0 fw-semibold">أو اضغط لتصفح الملفات من جهازك</p>
                <p className="text-muted small mt-2">الصيغ المدعومة: JPG, PNG, PDF, DOCX</p>
            </div>

            {/* إدخال الملفات المخفي */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*, .pdf, .doc, .docx"
                multiple
                hidden
                onChange={(e) => handleFiles(e.target.files)}
            />

            {/* منطقة عرض الملفات والصور المرفوعة */}
            {images.length > 0 && (
                <div className="d-flex flex-wrap gap-3">
                    {images.map((file, index) => {
                        // التحقق إذا كان المرفق صورة لعرضها، أو ملف لعرض الأيقونة
                        const isImage = file.type.startsWith('image/');
                        
                        return (
                            <div key={index} className="position-relative border rounded-4 p-2 bg-white d-flex flex-column align-items-center justify-content-center shadow-sm hover-effect" style={{ width: '120px', height: '120px' }}>
                                {isImage ? (
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`مرفق ${index + 1}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                                    />
                                ) : (
                                    <div className="text-center w-100">
                                        <FaFileAlt size={35} className="text-danger mb-2" />
                                        <div className="small text-truncate w-100 fw-bold px-1 text-muted" title={file.name}>
                                            {file.name}
                                        </div>
                                    </div>
                                )}
                                
                                {/* زر الحذف العائم */}
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm rounded-circle position-absolute d-flex align-items-center justify-content-center shadow"
                                    style={{ top: '-8px', right: '-8px', width: '28px', height: '28px' }}
                                    onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                                    title="حذف المرفق"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ImageUploader;