"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, AlertCircle, ArrowLeft, ArrowRight, X, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { JobScraperService, type JobListing } from "@/lib/job-scraper"

interface JobApplicationFormProps {
  jobId: string
}

interface DocumentFile {
  id: string
  name: string
  type: string
  size: number
  file: File
  uploaded: boolean
}

const REQUIRED_DOCUMENTS = [
  { id: "photo", name: "Passport Size Photo", accept: "image/*", required: true },
  { id: "signature", name: "Signature", accept: "image/*", required: true },
  { id: "education", name: "Educational Certificate", accept: ".pdf,.jpg,.jpeg,.png", required: true },
  { id: "experience", name: "Experience Certificate", accept: ".pdf,.jpg,.jpeg,.png", required: false },
  { id: "caste", name: "Caste Certificate", accept: ".pdf,.jpg,.jpeg,.png", required: false },
  { id: "identity", name: "Identity Proof (Aadhar/PAN)", accept: ".pdf,.jpg,.jpeg,.png", required: true },
]

export function JobApplicationForm({ jobId }: JobApplicationFormProps) {
  const [job, setJob] = useState<JobListing | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [documents, setDocuments] = useState<DocumentFile[]>([])
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: "",
      fatherName: "",
      motherName: "",
      dateOfBirth: "",
      gender: "",
      category: "",
      address: "",
      pincode: "",
      phone: "",
      email: "",
    },
    additionalInfo: {
      experience: "",
      skills: "",
      whyApply: "",
    },
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchJobDetails()
  }, [jobId])

  const fetchJobDetails = async () => {
    try {
      const jobData = await JobScraperService.fetchJobById(jobId)
      if (jobData) {
        setJob(jobData)
      }
    } catch (error) {
      console.error("Error fetching job details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (documentId: string, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast({
        title: "File too large",
        description: "Please select a file smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    const newDocument: DocumentFile = {
      id: documentId,
      name: file.name,
      type: file.type,
      size: file.size,
      file: file,
      uploaded: true,
    }

    setDocuments((prev) => {
      const filtered = prev.filter((doc) => doc.id !== documentId)
      return [...filtered, newDocument]
    })

    toast({
      title: "File uploaded",
      description: `${file.name} has been uploaded successfully`,
    })
  }

  const removeDocument = (documentId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
  }

  const getUploadedDocument = (documentId: string) => {
    return documents.find((doc) => doc.id === documentId)
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        const { personalInfo } = formData
        return (
          personalInfo.fullName &&
          personalInfo.fatherName &&
          personalInfo.motherName &&
          personalInfo.dateOfBirth &&
          personalInfo.phone &&
          personalInfo.email
        )
      case 2:
        const requiredDocs = REQUIRED_DOCUMENTS.filter((doc) => doc.required)
        return requiredDocs.every((doc) => getUploadedDocument(doc.id))
      case 3:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (isStepValid(currentStep)) {
      setCurrentStep((prev) => prev + 1)
    } else {
      toast({
        title: "Incomplete Information",
        description: "Please fill all required fields before proceeding",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async () => {
    if (!job) return

    try {
      setIsLoading(true)

      // Create application data
      const applicationData = {
        jobId: job.id,
        personalInfo: formData.personalInfo,
        additionalInfo: formData.additionalInfo,
        documents: documents.map((doc) => ({
          id: doc.id,
          name: doc.name,
          type: doc.type,
          size: doc.size,
        })),
        applicationFee: job.applicationFee,
        submittedAt: new Date().toISOString(),
      }

      // In a real app, you would upload files and save application data
      console.log("Application Data:", applicationData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully",
      })

      // Redirect to payment if fee is required
      if (job.applicationFee > 0) {
        window.location.href = `/jobs/${jobId}/payment`
      } else {
        window.location.href = `/dashboard?applied=${jobId}`
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (isLoading || !job) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => window.history.back()} className="bg-transparent">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Apply for Job</h1>
          <p className="text-gray-600">{job.title}</p>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Step {currentStep} of 3</span>
            <span className="text-sm text-gray-600">
              {currentStep === 1 && "Personal Information"}
              {currentStep === 2 && "Document Upload"}
              {currentStep === 3 && "Review & Submit"}
            </span>
          </div>
          <Progress value={(currentStep / 3) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Please provide your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.personalInfo.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, fullName: e.target.value },
                    }))
                  }
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name *</Label>
                <Input
                  id="fatherName"
                  value={formData.personalInfo.fatherName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, fatherName: e.target.value },
                    }))
                  }
                  placeholder="Enter father's name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motherName">Mother's Name *</Label>
                <Input
                  id="motherName"
                  value={formData.personalInfo.motherName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, motherName: e.target.value },
                    }))
                  }
                  placeholder="Enter mother's name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.personalInfo.dateOfBirth}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, dateOfBirth: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.personalInfo.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, phone: e.target.value },
                    }))
                  }
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, email: e.target.value },
                    }))
                  }
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.personalInfo.address}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, address: e.target.value },
                  }))
                }
                placeholder="Enter your complete address"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Document Upload */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Document Upload</CardTitle>
            <CardDescription>Upload required documents for your application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {REQUIRED_DOCUMENTS.map((docType) => {
              const uploadedDoc = getUploadedDocument(docType.id)

              return (
                <div key={docType.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">
                        {docType.name}
                        {docType.required && <span className="text-red-500 ml-1">*</span>}
                      </span>
                    </div>
                    {uploadedDoc && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-green-600">Uploaded</span>
                      </div>
                    )}
                  </div>

                  {uploadedDoc ? (
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-green-600" />
                        <div>
                          <div className="font-medium text-sm">{uploadedDoc.name}</div>
                          <div className="text-xs text-gray-600">{formatFileSize(uploadedDoc.size)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // In a real app, you'd show a preview
                            toast({
                              title: "Preview",
                              description: "Document preview would open here",
                            })
                          }}
                          className="bg-transparent"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeDocument(docType.id)}
                          className="bg-transparent text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">Max file size: 5MB</p>
                        <input
                          type="file"
                          accept={docType.accept}
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleFileUpload(docType.id, file)
                            }
                          }}
                          className="hidden"
                          id={`upload-${docType.id}`}
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById(`upload-${docType.id}`)?.click()}
                          className="bg-transparent"
                        >
                          Choose File
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Please ensure all documents are clear and readable. Supported formats: PDF,
                JPG, PNG. Maximum file size: 5MB per document.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review & Submit */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Your Application</CardTitle>
              <CardDescription>Please review all information before submitting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Info Summary */}
              <div>
                <h3 className="font-semibold mb-3">Personal Information</h3>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Full Name:</span>
                    <span>{formData.personalInfo.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Father's Name:</span>
                    <span>{formData.personalInfo.fatherName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span>{formData.personalInfo.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span>{formData.personalInfo.email}</span>
                  </div>
                </div>
              </div>

              {/* Documents Summary */}
              <div>
                <h3 className="font-semibold mb-3">Uploaded Documents</h3>
                <div className="space-y-2">
                  {documents.map((doc) => {
                    const docType = REQUIRED_DOCUMENTS.find((d) => d.id === doc.id)
                    return (
                      <div key={doc.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{docType?.name}:</span>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{doc.name}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Application Fee */}
              {job.applicationFee > 0 && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Application Fee:</strong> ₹{job.applicationFee} will be charged after submission. You will
                    be redirected to the payment page.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 1}
          className="bg-transparent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep < 3 ? (
          <Button onClick={handleNext} disabled={!isStepValid(currentStep)}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Application"}
          </Button>
        )}
      </div>
    </div>
  )
}
