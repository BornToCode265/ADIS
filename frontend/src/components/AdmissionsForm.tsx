
import React, { useState } from 'react';
import { GraduationCap, User, Mail, Phone, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const AdmissionsForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    childDob: '',
    grade: '',
    program: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Application Submitted Successfully!",
        description: "We'll contact you within 2 business days to discuss the next steps.",
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        childDob: '',
        grade: '',
        program: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="admissions" className="py-20 bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white rounded-full px-4 py-2 text-sm font-medium mb-4">
              <GraduationCap className="mr-2" size={16} />
              Start Your Journey
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Apply to Click Schools
            </h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Join our community of learners and take the first step towards academic excellence. 
              Fill out the form below and we'll guide you through the admissions process.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Parent/Guardian Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white flex items-center">
                    <User className="mr-2" size={16} />
                    Parent/Guardian Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white flex items-center">
                    <Mail className="mr-2" size={16} />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white flex items-center">
                    <Phone className="mr-2" size={16} />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    placeholder="+265 xxx xxx xxx"
                  />
                </div>

                {/* Child's Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="childDob" className="text-white flex items-center">
                    <Calendar className="mr-2" size={16} />
                    Child's Date of Birth
                  </Label>
                  <Input
                    id="childDob"
                    name="childDob"
                    type="date"
                    required
                    value={formData.childDob}
                    onChange={handleInputChange}
                    className="bg-white/20 border-white/30 text-white"
                  />
                </div>

                {/* Grade */}
                <div className="space-y-2">
                  <Label htmlFor="grade" className="text-white">Grade Level</Label>
                  <select
                    id="grade"
                    name="grade"
                    required
                    value={formData.grade}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white"
                  >
                    <option value="" className="text-gray-800">Select Grade</option>
                    <option value="Form 1" className="text-gray-800">Form 1</option>
                    <option value="Form 2" className="text-gray-800">Form 2</option>
                    <option value="Form 3" className="text-gray-800">Form 3</option>
                    <option value="Form 4" className="text-gray-800">Form 4</option>
                  </select>
                </div>

                {/* Program */}
                <div className="space-y-2">
                  <Label htmlFor="program" className="text-white">Program Type</Label>
                  <select
                    id="program"
                    name="program"
                    required
                    value={formData.program}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white"
                  >
                    <option value="" className="text-gray-800">Select Program</option>
                    <option value="Day School" className="text-gray-800">Day School</option>
                    <option value="Boarding School" className="text-gray-800">Boarding School</option>
                  </select>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-white flex items-center">
                  <FileText className="mr-2" size={16} />
                  Additional Information (Optional)
                </Label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder:text-white/70 resize-none"
                  placeholder="Tell us about your child's interests, achievements, or any special requirements..."
                />
              </div>

              {/* Submit Button */}
              <div className="text-center pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </div>

          {/* Contact Info */}
          <div className="text-center mt-8 text-white">
            <p className="mb-2">Questions about admissions?</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm">
              <a href="tel:+265888433833" className="flex items-center hover:text-blue-200">
                <Phone className="mr-1" size={14} />
                +265 888 43 38 33
              </a>
              <a href="mailto:hello@clickschools.org" className="flex items-center hover:text-blue-200">
                <Mail className="mr-1" size={14} />
                hello@clickschools.org
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdmissionsForm;
