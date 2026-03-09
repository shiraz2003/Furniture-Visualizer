import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDesign } from '../context/DesignContext';
import toast from 'react-hot-toast';

export default function RoomSetup() {
  const navigate = useNavigate();
  const { room, setRoom } = useDesign();

  const [formData, setFormData] = useState({
    width: room.width,
    length: room.length,
    height: room.height,
    wallColor: room.wallColor,
    floorColor: room.floorColor
  });

  const [errors, setErrors] = useState({});

  // Validation rules
  const validate = () => {
    const newErrors = {};

    if (formData.width < 1 || formData.width > 20) {
      newErrors.width = "Width must be between 1 and 20 meters";
    }
    if (formData.length < 1 || formData.length > 20) {
      newErrors.length = "Length must be between 1 and 20 meters";
    }
    if (formData.height < 2 || formData.height > 5) {
      newErrors.height = "Height must be between 2 and 5 meters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors before continuing");
      return;
    }

    setRoom({
      width: formData.width,
      length: formData.length,
      height: formData.height,
      wallColor: formData.wallColor,
      floorColor: formData.floorColor
    });

    toast.success("Room setup saved!");
    navigate('/editor-2d');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Room Setup</h1>
        <p style={styles.subtitle}>Configure your room dimensions and colors (all measurements in meters)</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Width */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Width (meters)</label>
            <input
              type="number"
              name="width"
              value={formData.width}
              onChange={handleChange}
              step="0.1"
              min="1"
              max="20"
              style={{
                ...styles.input,
                borderColor: errors.width ? '#e74c3c' : '#ddd'
              }}
            />
            {errors.width && <span style={styles.error}>{errors.width}</span>}
          </div>

          {/* Length */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Length (meters)</label>
            <input
              type="number"
              name="length"
              value={formData.length}
              onChange={handleChange}
              step="0.1"
              min="1"
              max="20"
              style={{
                ...styles.input,
                borderColor: errors.length ? '#e74c3c' : '#ddd'
              }}
            />
            {errors.length && <span style={styles.error}>{errors.length}</span>}
          </div>

          {/* Height */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Height (meters)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              step="0.1"
              min="2"
              max="5"
              style={{
                ...styles.input,
                borderColor: errors.height ? '#e74c3c' : '#ddd'
              }}
            />
            {errors.height && <span style={styles.error}>{errors.height}</span>}
          </div>

          {/* Wall Color */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Wall Color</label>
            <div style={styles.colorInputWrapper}>
              <input
                type="color"
                name="wallColor"
                value={formData.wallColor}
                onChange={handleChange}
                style={styles.colorInput}
              />
              <span style={styles.colorValue}>{formData.wallColor}</span>
            </div>
          </div>

          {/* Floor Color */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Floor Color</label>
            <div style={styles.colorInputWrapper}>
              <input
                type="color"
                name="floorColor"
                value={formData.floorColor}
                onChange={handleChange}
                style={styles.colorInput}
              />
              <span style={styles.colorValue}>{formData.floorColor}</span>
            </div>
          </div>

          {/* Room Preview */}
          <div style={styles.preview}>
            <h3 style={styles.previewTitle}>Preview</h3>
            <div style={{
              ...styles.previewRoom,
              backgroundColor: formData.floorColor,
              borderColor: formData.wallColor
            }}>
              <span style={styles.previewText}>
                {formData.width}m × {formData.length}m × {formData.height}m
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" style={styles.submitButton}>
            Continue to 2D Editor
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '28px',
    color: '#333'
  },
  subtitle: {
    margin: '0 0 30px 0',
    color: '#666',
    fontSize: '14px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333'
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #ddd',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  error: {
    color: '#e74c3c',
    fontSize: '12px'
  },
  colorInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  colorInput: {
    width: '50px',
    height: '40px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  colorValue: {
    fontSize: '14px',
    color: '#666'
  },
  preview: {
    marginTop: '10px',
    padding: '15px',
    background: '#f9f9f9',
    borderRadius: '8px'
  },
  previewTitle: {
    margin: '0 0 10px 0',
    fontSize: '14px',
    color: '#333'
  },
  previewRoom: {
    width: '100%',
    height: '100px',
    borderRadius: '8px',
    border: '4px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  previewText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    background: 'rgba(255,255,255,0.8)',
    padding: '5px 10px',
    borderRadius: '4px'
  },
  submitButton: {
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px'
  }
};