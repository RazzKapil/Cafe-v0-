// Job scraping service - currently using sample data due to site restrictions
// Can be easily replaced with real API integration

export interface JobListing {
  id: string
  title: string
  organization: string
  location: string
  qualification: string
  experience: string
  salary: string
  lastDate: string
  applicationFee: number
  description: string
  eligibility: string[]
  importantDates: {
    applicationStart: string
    applicationEnd: string
    examDate?: string
  }
  externalUrl: string
  category: string
  posts: number
}

// Sample job data (replace with real API calls)
const SAMPLE_JOBS: JobListing[] = [
  {
    id: "ssc-mts-2024",
    title: "Staff Selection Commission - Multi Tasking Staff (MTS)",
    organization: "Staff Selection Commission",
    location: "All India",
    qualification: "Matriculation (10th Pass) from recognized board",
    experience: "No experience required",
    salary: "₹18,000 - ₹22,000 per month",
    lastDate: "2024-03-15",
    applicationFee: 100,
    description:
      "Staff Selection Commission invites applications for Multi Tasking Staff positions across various government departments.",
    eligibility: [
      "Age: 18-25 years (relaxation as per govt rules)",
      "Education: 10th pass from recognized board",
      "Physical fitness required for some posts",
    ],
    importantDates: {
      applicationStart: "2024-02-01",
      applicationEnd: "2024-03-15",
      examDate: "2024-04-20",
    },
    externalUrl: "https://ssc.nic.in",
    category: "Central Government",
    posts: 8000,
  },
  {
    id: "rrb-alp-2024",
    title: "Railway Recruitment Board - Assistant Loco Pilot",
    organization: "Indian Railways",
    location: "All India",
    qualification: "ITI/Diploma in relevant trade",
    experience: "0-3 years",
    salary: "₹35,000 - ₹40,000 per month",
    lastDate: "2024-03-20",
    applicationFee: 500,
    description: "Indian Railways is recruiting Assistant Loco Pilots for various railway zones across India.",
    eligibility: [
      "Age: 18-28 years",
      "ITI in relevant trade OR Diploma in Engineering",
      "Medical fitness as per railway standards",
    ],
    importantDates: {
      applicationStart: "2024-02-05",
      applicationEnd: "2024-03-20",
      examDate: "2024-05-15",
    },
    externalUrl: "https://rrbcdg.gov.in",
    category: "Railway",
    posts: 5000,
  },
  {
    id: "ibps-po-2024",
    title: "IBPS - Probationary Officer",
    organization: "Institute of Banking Personnel Selection",
    location: "All India",
    qualification: "Graduate in any discipline",
    experience: "Fresher",
    salary: "₹40,000 - ₹50,000 per month",
    lastDate: "2024-03-25",
    applicationFee: 850,
    description: "IBPS conducts recruitment for Probationary Officers in various public sector banks.",
    eligibility: ["Age: 20-30 years", "Graduation from recognized university", "Computer knowledge essential"],
    importantDates: {
      applicationStart: "2024-02-10",
      applicationEnd: "2024-03-25",
      examDate: "2024-06-10",
    },
    externalUrl: "https://ibps.in",
    category: "Banking",
    posts: 3000,
  },
  {
    id: "upsc-cse-2024",
    title: "UPSC - Civil Services Examination",
    organization: "Union Public Service Commission",
    location: "All India",
    qualification: "Graduate from recognized university",
    experience: "No experience required",
    salary: "₹56,100 - ₹1,32,000 per month",
    lastDate: "2024-03-01",
    applicationFee: 200,
    description: "UPSC conducts Civil Services Examination for recruitment to various Group A and Group B services.",
    eligibility: [
      "Age: 21-32 years (relaxation for reserved categories)",
      "Graduate from recognized university",
      "Indian citizen",
    ],
    importantDates: {
      applicationStart: "2024-01-15",
      applicationEnd: "2024-03-01",
      examDate: "2024-06-05",
    },
    externalUrl: "https://upsc.gov.in",
    category: "Civil Services",
    posts: 1000,
  },
  {
    id: "delhi-police-constable-2024",
    title: "Delhi Police - Constable Recruitment",
    organization: "Delhi Police",
    location: "Delhi",
    qualification: "12th Pass from recognized board",
    experience: "No experience required",
    salary: "₹25,000 - ₹30,000 per month",
    lastDate: "2024-02-28",
    applicationFee: 100,
    description: "Delhi Police invites applications for Constable positions in various departments.",
    eligibility: ["Age: 18-25 years", "12th pass from recognized board", "Physical and medical fitness required"],
    importantDates: {
      applicationStart: "2024-01-20",
      applicationEnd: "2024-02-28",
      examDate: "2024-04-15",
    },
    externalUrl: "https://delhipolice.nic.in",
    category: "Police",
    posts: 2000,
  },
]

export class JobScraperService {
  // In production, this would make API calls to job sites
  static async fetchActiveJobs(): Promise<JobListing[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Filter jobs that haven't expired
    const currentDate = new Date()
    return SAMPLE_JOBS.filter((job) => new Date(job.lastDate) > currentDate)
  }

  static async fetchJobById(id: string): Promise<JobListing | null> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return SAMPLE_JOBS.find((job) => job.id === id) || null
  }

  static async searchJobs(query: string, category?: string): Promise<JobListing[]> {
    await new Promise((resolve) => setTimeout(resolve, 800))

    let jobs = SAMPLE_JOBS.filter((job) => new Date(job.lastDate) > new Date())

    if (query) {
      jobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(query.toLowerCase()) ||
          job.organization.toLowerCase().includes(query.toLowerCase()) ||
          job.location.toLowerCase().includes(query.toLowerCase()),
      )
    }

    if (category && category !== "all") {
      jobs = jobs.filter((job) => job.category.toLowerCase() === category.toLowerCase())
    }

    return jobs
  }

  // Method to integrate with real APIs when available
  static async integrateWithSarkariResult(): Promise<JobListing[]> {
    try {
      // This would be the real API integration
      // const response = await fetch('/api/scrape-sarkari-result')
      // const jobs = await response.json()
      // return jobs

      // For now, return sample data
      return this.fetchActiveJobs()
    } catch (error) {
      console.error("Failed to fetch from Sarkari Result:", error)
      return this.fetchActiveJobs() // Fallback to sample data
    }
  }
}
