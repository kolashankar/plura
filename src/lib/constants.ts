import BarChart from '@/components/icons/bar_chart'
import Calendar from '@/components/icons/calendar'
import CheckCircle from '@/components/icons/check_circled'
import Chip from '@/components/icons/chip'
import ClipboardIcon from '@/components/icons/clipboardIcon'
import { Store, ShoppingBag, Package, Puzzle, Palette, DollarSign } from 'lucide-react'
import Compass from '@/components/icons/compass'
import Database from '@/components/icons/database'
import Flag from '@/components/icons/flag'
import Headphone from '@/components/icons/headphone'
import Home from '@/components/icons/home'
import Info from '@/components/icons/info'
import LinkIcon from '@/components/icons/link'
import Lock from '@/components/icons/lock'
import Message from '@/components/icons/messages'
import Notification from '@/components/icons/notification'
import Payment from '@/components/icons/payment'
import Person from '@/components/icons/person'
import Pipelines from '@/components/icons/pipelines'
import PluraCategory from '@/components/icons/plura-category'
import Power from '@/components/icons/power'
import Receipt from '@/components/icons/receipt'
import Send from '@/components/icons/send'
import Settings from '@/components/icons/settings'
import Shield from '@/components/icons/shield'
import Star from '@/components/icons/star'
import Tune from '@/components/icons/tune'
import Video from '@/components/icons/video_recorder'
import Wallet from '@/components/icons/wallet'
import Warning from '@/components/icons/warning'
export const pricingCards = [
  {
    title: 'Starter',
    description: 'Perfect for trying out plura',
    price: 'Free',
    duration: '',
    highlight: 'Key features',
    features: ['3 Sub accounts', '2 Team members', 'Unlimited pipelines'],
    priceId: '',
  },
  {
    title: 'Basic',
    description: 'For serious agency owners',
    price: '$49',
    duration: 'month',
    highlight: 'Everything in Starter, plus',
    features: ['Unlimited Sub accounts', 'Unlimited Team members'],
    priceId: 'price_1OzWu5SCZtpG0Bi9Vn0PF4Q5',
  },
  {
    title: 'Unlimited Saas',
    description: 'The ultimate agency kit',
    price: '$199',
    duration: 'month',
    highlight: 'Key features',
    features: ['Rebilling', '24/7 Support team'],
    priceId: 'price_1OzWu4SCZtpG0Bi9uaOLW13b',
  },
]

export const addOnProducts = [
  { title: 'Priority Support', id: 'prod_PpBPcGW8vY2aNp' },
]

export const icons = [
  {
    value: 'chart',
    label: 'Bar Chart',
    path: BarChart,
  },
  {
    value: 'headphone',
    label: 'Headphones',
    path: Headphone,
  },
  {
    value: 'send',
    label: 'Send',
    path: Send,
  },
  {
    value: 'pipelines',
    label: 'Pipelines',
    path: Pipelines,
  },
  {
    value: 'calendar',
    label: 'Calendar',
    path: Calendar,
  },
  {
    value: 'settings',
    label: 'Settings',
    path: Settings,
  },
  {
    value: 'check',
    label: 'Check Circled',
    path: CheckCircle,
  },
  {
    value: 'chip',
    label: 'Chip',
    path: Chip,
  },
  {
    value: 'compass',
    label: 'Compass',
    path: Compass,
  },
  {
    value: 'database',
    label: 'Database',
    path: Database,
  },
  {
    value: 'flag',
    label: 'Flag',
    path: Flag,
  },
  {
    value: 'home',
    label: 'Home',
    path: Home,
  },
  {
    value: 'info',
    label: 'Info',
    path: Info,
  },
  {
    value: 'link',
    label: 'Link',
    path: LinkIcon,
  },
  {
    value: 'lock',
    label: 'Lock',
    path: Lock,
  },
  {
    value: 'messages',
    label: 'Messages',
    path: Message,
  },
  {
    value: 'notification',
    label: 'Notification',
    path: Notification,
  },
  {
    value: 'payment',
    label: 'Payment',
    path: Payment,
  },
  {
    value: 'power',
    label: 'Power',
    path: Power,
  },
  {
    value: 'receipt',
    label: 'Receipt',
    path: Receipt,
  },
  {
    value: 'shield',
    label: 'Shield',
    path: Shield,
  },
  {
    value: 'star',
    label: 'Star',
    path: Star,
  },
  {
    value: 'tune',
    label: 'Tune',
    path: Tune,
  },
  {
    value: 'videorecorder',
    label: 'Video Recorder',
    path: Video,
  },
  {
    value: 'wallet',
    label: 'Wallet',
    path: Wallet,
  },
  {
    value: 'warning',
    label: 'Warning',
    path: Warning,
  },
  {
    value: 'person',
    label: 'Person',
    path: Person,
  },
  {
    value: 'category',
    label: 'Category',
    path: PluraCategory,
  },
  {
    value: 'clipboardIcon',
    label: 'Clipboard Icon',
    path: ClipboardIcon,
  },
  {
    value: 'store',
    label: 'Store',
    path: Store,
  },
  {
    value: 'shopping',
    label: 'Shopping',
    path: ShoppingBag,
  },
  {
    value: 'package',
    label: 'Package',
    path: Package,
  },
  {
    value: 'plugins',
    label: 'Plugins',
    path: Puzzle,
  },
  {
    value: 'themes',
    label: 'Themes',
    path: Palette,
  },
  {
    value: 'dollarsign',
    label: 'Dollar Sign',
    path: DollarSign,
  },
  {
    value: 'media',
    label: 'Media',
    path: Database,
  },
  {
    value: 'workflows',
    label: 'Workflows', 
    path: Send,
  },
]

export type EditorBtns =
  | 'text'
  | 'container'
  | 'section'
  | '2Col'
  | '3Col'
  | '4Col'
  | 'gridLayout'
  | 'flexbox'
  | 'spacer'
  | 'wrapper'
  | 'card'
  | 'accordion'
  | 'tabs'
  | 'modal'
  | 'drawer'
  | 'divider'
  | 'navbar'
  | 'menu'
  | 'breadcrumb'
  | 'pagination'
  | 'sidebar'
  | 'footer'
  | 'dropdown'
  | 'button'
  | 'buttonGroup'
  | 'steps'
  | 'tableOfContents'
  | null
  | 'stickyNav'
  | 'megaMenu'
  | 'logo'
  | 'video'
  | 'image'
  | 'gallery'
  | 'carousel'
  | 'slider'
  | 'audioPlayer'
  | 'pdfViewer'
  | 'youtubeEmbed'
  | 'vimeoEmbed'
  | 'icon'
  | 'avatar'
  | 'backgroundImage'
  | 'lightbox'
  | 'view360'
  | 'masonryGrid'
  | 'contactForm'
  | 'inputField'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radioButton'
  | 'fileUpload'
  | 'datePicker'
  | 'timePicker'
  | 'numberInput'
  | 'rangeSlider'
  | 'switch'
  | 'rating'
  | 'surveyForm'
  | 'newsletterSignup'
  | 'paymentForm'
  | 'productCard'
  | 'shoppingCart'
  | 'productGrid'
  | 'productFilter'
  | 'searchBar'
  | 'wishlist'
  | 'reviews'
  | 'priceDisplay'
  | 'discountBadge'
  | 'quickView'
  | 'compareProducts'
  | 'shippingCalculator'
  | 'couponCode'
  | 'paymentMethods'
  | 'heading'
  | 'paragraph'
  | 'list'
  | 'quote'
  | 'timeline'
  | 'testimonial'
  | 'blogPost'
  | 'newsArticle'
  | 'faq'
  | 'pricingCard'
  | 'featureList'
  | 'statistics'
  | 'callToAction'
  | 'embedCode'
  | 'socialMedia'
  | '__body'
  | 'link'
  // Analytics & Data Components
  | 'lineChart'
  | 'pieChart'
  | 'barChart'
  | 'areaChart'
  | 'donutChart'
  | 'progressChart'
  | 'analyticsWidget'
  | 'dataTable'
  | 'heatmap'
  | 'treemap'
  | 'gaugeChart'
  | 'sparkline'
  | 'kpiCard'
  | 'dashboard'
  | 'metric'
  // Interactive & Animation Components
  | 'parallaxSection'
  | 'scrollAnimation'
  | 'hoverEffects'
  | 'particleBackground'
  | 'morphingShape'
  | 'countUpAnimation'
  | 'typingEffect'
  | 'revealOnScroll'
  | 'floatingElements'
  | 'magneticButtons'
  | 'glitchEffect'
  | 'waveAnimation'
  | 'bounceAnimation'
  | 'fadeTransition'
  | 'slideTransition'
  // Content Management Components  
  | 'contentBlock'
  | 'richTextEditor'
  | 'markdownRenderer'
  | 'codeEditor'
  | 'syntaxHighlighter'
  // AI & Generated Components
  | 'aiComponent'
  | 'generatedComponent'
  | 'documentViewer'
  | 'articlePreview'
  | 'contentCarousel'
  | 'blogGrid'
  | 'newsFlash'
  | 'eventCalendar'
  | 'bookmarkList'
  | 'readingProgress'
  | 'tableOfContentsAuto'
  | 'contentFilter'
  // Social & Communication Components
  | 'socialFeed'
  | 'twitterEmbed'
  | 'instagramEmbed'
  | 'youtubeChannel'
  | 'linkedinPost'
  | 'facebookPage'
  | 'discordWidget'
  | 'liveChat'
  | 'commentSystem'
  | 'userProfiles'
  | 'followerCount'
  | 'shareButtons'
  | 'socialLogin'
  | 'messagingWidget'
  | 'forumPost'
  // Advanced UI Components
  | 'infiniteScroll'
  | 'virtualScroll'
  | 'draggableList'
  | 'sortableGrid'
  | 'resizablePanels'
  | 'splitScreen'
  | 'imageComparison'
  | 'beforeAfter'
  | 'zoomViewer'
  | 'fullscreenModal'
  | 'offCanvasMenu'
  | 'stickyElement'
  | 'floatingWidget'
  | 'contextMenu'
  | 'tooltipSystem'

export const defaultStyles: React.CSSProperties = {
  backgroundPosition: 'center',
  objectFit: 'cover',
  backgroundRepeat: 'no-repeat',
  textAlign: 'left',
  opacity: '100%',
}