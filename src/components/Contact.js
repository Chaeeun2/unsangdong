import React, { useState, useEffect } from 'react';
import './Contact.css';
import { contactService } from '../admin/services/dataService';
import { getFirestore, collection, addDoc } from "@firebase/firestore";
import emailjs from '@emailjs/browser';

// EmailJS 초기화
emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);

function Contact() {
  const [loading, setLoading] = useState(true);
  const [contactInfo, setContactInfo] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phoneNumber: '',
    inquiryTitle: '',
    inquiryContent: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Firebase에서 Contact 정보 로드
  useEffect(() => {
    async function loadContactInfo() {
      try {
        setLoading(true);
        const data = await contactService.getContactInfo();
        setContactInfo(data);
      } catch (error) {
        // 실패 시 기본값 사용
        setContactInfo(contactService.getDefaultContactInfo());
      } finally {
        setLoading(false);
      }
    }

    loadContactInfo();
  }, []);

  // 폼 입력 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // EmailJS를 사용한 이메일 발송
  const sendEmailViaEmailJS = async (formData) => {
    const templateParams = {
      to_email: 'ryuchaeun.design@gmail.com', // 받을 이메일 주소
      company_name: formData.companyName,
      contact_name: formData.contactName,
      email: formData.email,
      phone_number: formData.phoneNumber,
      inquiry_title: formData.inquiryTitle,
      inquiry_content: formData.inquiryContent,
      timestamp: new Date().toLocaleString()
    };

    await emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID, // 실제 Service ID로 변경
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID, // 실제 Template ID로 변경
      templateParams,
      process.env.REACT_APP_EMAILJS_PUBLIC_KEY // 실제 Public Key로 변경
    );
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (submitting) return;

    // 필수 필드 검증
    if (!formData.companyName || !formData.contactName || !formData.email || 
        !formData.phoneNumber || !formData.inquiryTitle || !formData.inquiryContent) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      
      // 1. 문의사항을 inquiries 컬렉션에 저장
      await contactService.saveInquiry(formData);
      
      // 2. EmailJS를 사용한 이메일 발송
      await sendEmailViaEmailJS(formData);

      alert('문의사항이 성공적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.');
      
      // 폼 초기화
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phoneNumber: '',
        inquiryTitle: '',
        inquiryContent: ''
      });
    } catch (error) {
      alert('문의사항 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !contactInfo) {
    return (
      <div className="contact-container">
        <div className="contact-left-wrap">
          <div className="contact-title">CONTACT</div>
          <div className="contact-info">
            로딩 중...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-container">
      <div className="contact-left-wrap">
        <div className="contact-title">CONTACT</div>
        <div className="contact-info">
          <div className="contact-address">
            <p className="contact-address-ko">{contactInfo.address.ko}</p>
            <p className="contact-address-en">{contactInfo.address.en}</p>
          </div>
          <div className="contact-number-wrap">
            <div className="contact-number-title-wrap">
              <p className="contact-number-title">Email</p>
              <p className="contact-number-title">Tel</p>
              <p className="contact-number-title">Fax</p>
              <p className="contact-number-title">SNS</p>
            </div>
            <div className="contact-number-content-wrap">
              <p className="contact-number-content">
                <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
              </p>
              <p className="contact-number-content">{contactInfo.tel}</p>
              <p className="contact-number-content">{contactInfo.fax}</p>
              <p className="contact-number-content">
                <a href={contactInfo.sns.url} target="_blank" rel="noopener noreferrer">
                  {contactInfo.sns.instagram}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="contact-right-wrap">
        <div className="contact-form-section">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row company-name">
              <div className="form-group">
                <label className="form-label">회사명</label>
                <input 
                  type="text" 
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="Company name"
                  required
                  disabled={submitting}
                />
              </div>
            </div>
            
            <div className="form-row your-name">
              <div className="form-group">
                <label className="form-label">담당자 성함</label>
                <input 
                  type="text" 
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="Your name"
                  required
                  disabled={submitting}
                />
              </div>
            </div>
            
            <div className="form-row e-mail">
              <div className="form-group">
                <label className="form-label">이메일</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="E-mail"
                  required
                  disabled={submitting}
                />
              </div>
            </div>
            
            <div className="form-row phone-number">
              <div className="form-group">
                <label className="form-label">담당자 연락처</label>
                <input 
                  type="tel" 
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="Phone Number"
                  required
                  disabled={submitting}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">문의 제목</label>
                <input 
                  type="text" 
                  name="inquiryTitle"
                  value={formData.inquiryTitle}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="Inquiry title"
                  required
                  disabled={submitting}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">문의 내용</label>
                <textarea 
                  name="inquiryContent"
                  value={formData.inquiryContent}
                  onChange={handleInputChange}
                  className="form-textarea" 
                  rows="8"
                  placeholder="Describe your inquiry"
                  required
                  disabled={submitting}
                ></textarea>
              </div>
            </div>
            
            <div className="form-row">
              <button type="submit" className="form-submit-btn" disabled={submitting}>
                {submitting ? '전송 중...' : 'SEND'}
                {!submitting && <span className="form-submit-btn-arrow">→</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact; 