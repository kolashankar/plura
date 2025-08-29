'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { 
  CheckCircle, 
  Download, 
  Mail, 
  FileText, 
  MessageSquare,
  ExternalLink,
  Star
} from 'lucide-react'

type Props = {
  params: { themeId: string }
  searchParams: { session_id?: string }
}

const ThemeSuccessPage = ({ params, searchParams }: Props) => {
  const [downloadReady, setDownloadReady] = useState(false)

  // Mock theme data - replace with actual API call
  const theme = {
    id: params.themeId,
    name: "Modern Business Pro",
    price: 89.99,
    seller: "ThemeStudio",
    downloadUrl: "/api/marketplace/themes/download/" + params.themeId,
    documentationUrl: "/docs/themes/" + params.themeId,
    supportUrl: "/support/theme/" + params.themeId
  }

  useEffect(() => {
    // Simulate download preparation
    const timer = setTimeout(() => {
      setDownloadReady(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleDownload = async () => {
    try {
      const response = await fetch(theme.downloadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: searchParams.session_id
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `${theme.name.toLowerCase().replace(/\s+/g, '-')}-theme.zip`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Purchase Successful!</h1>
            <p className="text-muted-foreground">
              You&apos;re all set! Your theme has been successfully
            </p>
          </div>

          {/* Download Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Download Your Theme
              </CardTitle>
              <CardDescription>
                Your theme files are ready for download
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!downloadReady ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Preparing your download...</p>
                </div>
              ) : (
                <>
                  <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-700 dark:text-green-400 font-medium">
                        Download Ready
                      </span>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Your theme package includes all files, documentation, and license.
                    </p>
                  </div>

                  <Button onClick={handleDownload} className="w-full" size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    Download Theme Files
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Download link is also sent to your email address
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <Link 
                  href={theme.documentationUrl}
                  className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">Installation Guide</div>
                    <div className="text-sm text-muted-foreground">
                      Step-by-step setup instructions
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </Link>

                <Link 
                  href={theme.supportUrl}
                  className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">Get Support</div>
                    <div className="text-sm text-muted-foreground">
                      Need help? Our team is here for you
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Theme:</span>
                  <span className="font-medium">{theme.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Seller:</span>
                  <span>{theme.seller}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span className="font-medium">${theme.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-mono text-sm">{searchParams.session_id?.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span>License:</span>
                  <Badge variant="secondary">Commercial</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Notice */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Confirmation Email Sent</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent a confirmation email with your purchase details, 
                    download links, and license information to your email address.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/marketplace">
                Browse More Themes
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/agency">
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThemeSuccessPage