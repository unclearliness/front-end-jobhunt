# JobHunter Design System Documentation

Đây là tài liệu chi tiết về hệ thống thiết kế của JobHunter - Nền tảng tuyển dụng việc làm.

---

## 🎨 HỆ THỐNG MÀU SẮC (COLOR PALETTE)

### Màu Chính (Primary Colors)

```css
--primary: #2563eb                    /* Màu xanh dương chủ đạo */
--primary-foreground: #ffffff          /* Chữ trên nền primary (trắng) */
```

**Sử dụng:** 
- Buttons chính (Primary Button)
- Links quan trọng
- Icons nổi bật
- Highlight elements
- Active states

### Màu Nền (Background Colors)

```css
--background: #ffffff                  /* Nền chính (trắng) */
--card: #ffffff                        /* Nền card (trắng) */
--muted: #ececf0                       /* Nền mờ/nhạt (xám sáng) */
--accent: #e9ebef                      /* Nền accent (xám nhạt hơn) */
--input-background: #f3f3f5            /* Nền ô input */
```

**Sử dụng:**
- `background`: Nền trang chính
- `card`: Nền các card, modal, dropdown
- `muted`: Background sections, disabled states
- `accent`: Hover states, subtle highlights
- `input-background`: Ô nhập liệu (Input, Textarea, Select)

### Màu Chữ (Text Colors)

```css
--foreground: oklch(0.145 0 0)         /* Chữ chính (đen đậm) */
--card-foreground: oklch(0.145 0 0)    /* Chữ trên card */
--muted-foreground: #717182            /* Chữ phụ/mờ (xám) */
--secondary-foreground: #030213        /* Chữ secondary */
```

**Sử dụng:**
- `foreground`: Tiêu đề, text chính
- `muted-foreground`: Text phụ, descriptions, labels, placeholders
- Tỷ lệ: Chữ chính 70%, chữ phụ 30%

### Màu Phụ (Secondary Colors)

```css
--secondary: oklch(0.95 0.0058 264.53) /* Xám nhạt */
--secondary-foreground: #030213        /* Chữ trên nền secondary */
```

**Sử dụng:**
- Secondary buttons
- Tags/Badges không quan trọng
- Alternative actions

### Màu Trạng Thái (Status Colors)

```css
--success: #10b981                     /* Xanh lá - Thành công */
--success-foreground: #ffffff          /* Chữ trên nền success */

--destructive: #d4183d                 /* Đỏ - Nguy hiểm/Xóa */
--destructive-foreground: #ffffff      /* Chữ trên nền destructive */
```

**Sử dụng:**
- `success`: Trạng thái "Active", "Verified", "Success", "Approved"
- `destructive`: Nút Delete, trạng thái "Rejected", "Failed", Errors

### Màu Viền và Input (Border & Input)

```css
--border: rgba(0, 0, 0, 0.1)          /* Viền mỏng (đen 10% opacity) */
--input: transparent                   /* Viền input (trong suốt) */
--ring: oklch(0.708 0 0)              /* Focus ring (xám) */
```

**Sử dụng:**
- `border`: Tất cả borders (cards, dividers, tables)
- `ring`: Focus outline khi tab/focus vào elements

### Màu Badge Đặc Biệt (Custom Badge Colors)

```css
/* Xanh dương - New, Under Review */
bg-blue-100 text-blue-800 (light mode)
dark:bg-blue-900 dark:text-blue-200 (dark mode)

/* Xanh lá - Active, Verified, Success */
bg-green-100 text-green-800
dark:bg-green-900 dark:text-green-200

/* Vàng - Pending, Reviewing, Warning */
bg-yellow-100 text-yellow-800
dark:bg-yellow-900 dark:text-yellow-200

/* Tím - Interview, Special Status */
bg-purple-100 text-purple-800
dark:bg-purple-900 dark:text-purple-200

/* Đỏ - Rejected, Closed, Error */
bg-red-100 text-red-800
dark:bg-red-900 dark:text-red-200

/* Xám - Inactive, Closed, Neutral */
bg-gray-100 text-gray-800
dark:bg-gray-900 dark:text-gray-200
```

---

## ✍️ HỆ THỐNG TYPOGRAPHY

### Kích Thước Font (Font Sizes)

```css
--font-size: 16px                      /* Base font size */

/* Heading Sizes (sử dụng CSS variables) */
h1: var(--text-2xl)                    /* ~30-32px - Tiêu đề chính trang */
h2: var(--text-xl)                     /* ~24-28px - Tiêu đề section */
h3: var(--text-lg)                     /* ~18-20px - Tiêu đề subsection */
h4: var(--text-base)                   /* 16px - Tiêu đề nhỏ */

/* Text Sizes */
text-sm: 14px                          /* Text nhỏ, captions */
text-base: 16px                        /* Text thông thường */
text-lg: 18px                          /* Text lớn hơn */
text-xl: 20-24px                       /* Text rất lớn */
text-2xl: 30-32px                      /* Headings */
```

### Font Weight (Độ Đậm)

```css
--font-weight-normal: 400              /* Text thông thường */
--font-weight-medium: 500              /* Headings, Labels, Buttons */
```

**Quy tắc:**
- Headings (h1-h4): `font-weight: 500`
- Labels: `font-weight: 500`
- Buttons: `font-weight: 500`
- Paragraph/Input: `font-weight: 400`

### Line Height

```css
line-height: 1.5                       /* Tất cả elements */
```

### Font Family

```
Sử dụng system font stack mặc định của Tailwind
```

---

## 📏 HỆ THỐNG SPACING

### Spacing Scale (Tailwind)

```
gap-1: 4px
gap-2: 8px
gap-3: 12px
gap-4: 16px
gap-6: 24px
gap-8: 32px

p-2: 8px padding
p-3: 12px padding
p-4: 16px padding
p-6: 24px padding
p-8: 32px padding

mb-2: 8px margin bottom
mb-4: 16px margin bottom
mb-6: 24px margin bottom
```

### Spacing Guidelines

**Cards:**
- Padding: `p-6` (24px)
- Gap giữa sections: `space-y-6` (24px)
- Gap giữa form fields: `space-y-4` (16px)

**Buttons:**
- Gap giữa icon và text: `gap-2` (8px)
- Gap giữa các buttons: `gap-2` hoặc `gap-3`

**Lists:**
- Gap giữa items: `space-y-4` (16px)
- Gap trong item: `gap-3` hoặc `gap-4`

---

## 🔘 BUTTONS

### Button Variants

#### 1. Primary Button (Default)
```tsx
<Button>Click Me</Button>
```
- Background: `#2563eb` (primary)
- Text: `#ffffff`
- Hover: Darker blue
- Dùng cho: Actions chính (Submit, Save, Apply, Create)

#### 2. Secondary Button
```tsx
<Button variant="secondary">Click Me</Button>
```
- Background: `#ececf0` (muted)
- Text: `#030213`
- Dùng cho: Actions phụ không quan trọng

#### 3. Outline Button
```tsx
<Button variant="outline">Click Me</Button>
```
- Background: Transparent
- Border: 1px solid border color
- Text: foreground color
- Dùng cho: Cancel, View Details, Alternative actions

#### 4. Ghost Button
```tsx
<Button variant="ghost">Click Me</Button>
```
- Background: Transparent
- No border
- Hover: Slight background
- Dùng cho: Icon buttons, subtle actions

#### 5. Destructive Button
```tsx
<Button variant="destructive">Delete</Button>
```
- Background: `#d4183d` (destructive)
- Text: `#ffffff`
- Dùng cho: Delete, Remove, Reject actions

### Button Sizes

```tsx
<Button size="sm">Small</Button>           /* Nhỏ */
<Button size="default">Default</Button>    /* Mặc định */
<Button size="lg">Large</Button>           /* Lớn */
<Button size="icon">Icon</Button>          /* Icon only (vuông) */
```

### Button with Icon

```tsx
<Button>
  <PlusCircle className="w-4 h-4 mr-2" />
  Add Job
</Button>
```

**Quy tắc:**
- Icon size: `w-4 h-4` (16px)
- Gap: `mr-2` (8px) giữa icon và text
- Icon position: Trái (thường) hoặc phải

---

## 🎴 CARDS

### Card Structure

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    Footer actions
  </CardFooter>
</Card>
```

### Card Styles

- Background: `#ffffff` (white)
- Border: `1px solid rgba(0, 0, 0, 0.1)`
- Border Radius: `10px` (0.625rem)
- Padding: `24px` (p-6)
- Shadow: None (default), `shadow-lg` on hover

### Card Hover Effect

```tsx
<Card className="hover:shadow-lg transition-shadow">
```

---

## 🏷️ BADGES

### Badge Variants

#### 1. Default Badge
```tsx
<Badge>Default</Badge>
```
- Background: primary
- Text: primary-foreground

#### 2. Secondary Badge
```tsx
<Badge variant="secondary">Secondary</Badge>
```
- Background: secondary
- Text: secondary-foreground

#### 3. Outline Badge
```tsx
<Badge variant="outline">Outline</Badge>
```
- Background: transparent
- Border: 1px solid

#### 4. Destructive Badge
```tsx
<Badge variant="destructive">Delete</Badge>
```
- Background: destructive
- Text: destructive-foreground

### Badge với Custom Colors

```tsx
<Badge className="bg-green-100 text-green-800">Active</Badge>
<Badge className="bg-blue-100 text-blue-800">New</Badge>
<Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
<Badge className="bg-red-100 text-red-800">Rejected</Badge>
```

---

## 📝 FORMS

### Input Fields

```tsx
<Input placeholder="Enter text..." />
```

- Background: `#f3f3f5` (input-background)
- Border: `1px solid border`
- Border Radius: `10px`
- Padding: `8px 12px`
- Height: `40px` (default)
- Font: `16px`, weight `400`

### Input with Icon

```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
  <Input placeholder="Search..." className="pl-10" />
</div>
```

### Textarea

```tsx
<Textarea 
  placeholder="Description..."
  className="min-h-[100px]"
/>
```

### Select Dropdown

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Label

```tsx
<Label htmlFor="email">Email Address</Label>
<Input id="email" type="email" />
```

- Font weight: `500` (medium)
- Font size: `16px`
- Color: foreground

---

## 📊 TABLES

### Table Structure

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      <TableCell>
        <Button size="icon" variant="ghost">
          <Edit className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Table Styles

- Border: `1px solid border`
- Row hover: Subtle background
- Header: Font weight `500`
- Cell padding: `12px 16px`

---

## 🎯 ICONS

### Icon Library

```tsx
import { IconName } from "lucide-react";
```

Sử dụng: **lucide-react** package

### Icon Sizes

```tsx
/* Thường dùng */
<Icon className="w-4 h-4" />    /* 16px - Trong buttons, badges */
<Icon className="w-5 h-5" />    /* 20px - Icons standalone */
<Icon className="w-6 h-6" />    /* 24px - Header icons */
<Icon className="w-8 h-8" />    /* 32px - Large icons */
<Icon className="w-12 h-12" />  /* 48px - Hero icons */
```

### Icon Colors

```tsx
<Icon className="text-primary" />          /* Màu primary */
<Icon className="text-muted-foreground" /> /* Màu xám nhạt */
<Icon className="text-destructive" />      /* Màu đỏ */
<Icon className="text-green-600" />        /* Màu xanh lá */
```

### Common Icons

```tsx
import {
  Search,          // Tìm kiếm
  MapPin,          // Vị trí
  Briefcase,       // Công việc
  Building2,       // Công ty
  Users,           // Người dùng
  Calendar,        // Ngày tháng
  DollarSign,      // Lương
  Clock,           // Thời gian
  Eye,             // Xem
  Edit,            // Sửa
  Trash2,          // Xóa
  Plus,            // Thêm
  ChevronRight,    // Mũi tên phải
  X,               // Đóng
  Check,           // Tick
  Filter,          // Lọc
  Upload,          // Tải lên
  Download,        // Tải xuống
  Mail,            // Email
  Phone,           // Điện thoại
  Shield,          // Admin
  TrendingUp,      // Tăng trưởng
} from "lucide-react";
```

---

## 🎨 BORDER RADIUS

```css
--radius: 0.625rem                     /* 10px - Mặc định */
--radius-sm: calc(var(--radius) - 4px) /* 6px */
--radius-md: calc(var(--radius) - 2px) /* 8px */
--radius-lg: var(--radius)             /* 10px */
--radius-xl: calc(var(--radius) + 4px) /* 14px */
```

**Sử dụng:**
- Cards: `rounded-lg` (10px)
- Buttons: `rounded-lg` (10px)
- Inputs: `rounded-lg` (10px)
- Badges: `rounded-full` hoặc `rounded-lg`
- Avatars: `rounded-full`
- Images: `rounded-lg`

---

## 🌓 DARK MODE

Ứng dụng hỗ trợ Dark Mode với palette riêng:

```css
.dark {
  --background: oklch(0.145 0 0);      /* Đen */
  --foreground: oklch(0.985 0 0);      /* Trắng */
  --primary: oklch(0.985 0 0);         /* Trắng */
  --muted: oklch(0.269 0 0);           /* Xám đậm */
  --border: oklch(0.269 0 0);          /* Xám đậm */
}
```

---

## 📐 LAYOUT GUIDELINES

### Container Width

```tsx
<div className="container mx-auto px-6">
  {/* Content với max-width responsive */}
</div>
```

### Grid Layouts

```tsx
/* 2 cột trên tablet, 3 cột trên desktop */
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

/* 4 cột stats */
<div className="grid md:grid-cols-4 gap-4">
```

### Spacing Between Sections

```tsx
<section className="py-16">           /* Section padding */
<div className="space-y-6">           /* Vertical spacing */
<div className="grid gap-6">          /* Grid gap */
```

---

## 🎭 COMPONENT PATTERNS

### Search Bar with Location

```tsx
<div className="flex gap-3">
  <div className="flex-1 relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
    <Input placeholder="Job title..." className="pl-10" />
  </div>
  <div className="flex-1 relative">
    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
    <Input placeholder="Location..." className="pl-10" />
  </div>
  <Button>Search</Button>
</div>
```

### Stat Card

```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between pb-2">
    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
    <Users className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">12,435</div>
    <p className="text-xs text-muted-foreground">+12.5% from last month</p>
  </CardContent>
</Card>
```

### List Item with Avatar

```tsx
<div className="flex items-start gap-4">
  <Avatar className="w-12 h-12">
    <AvatarFallback>JD</AvatarFallback>
  </Avatar>
  <div className="flex-1">
    <h4 className="mb-1">John Doe</h4>
    <p className="text-sm text-muted-foreground">Software Engineer</p>
  </div>
  <Badge>Active</Badge>
</div>
```

---

## 🎯 USAGE EXAMPLES

### Job Card

```tsx
<Card className="hover:shadow-lg transition-shadow">
  <CardHeader>
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
        <span className="font-semibold text-primary">TC</span>
      </div>
      <div className="flex-1">
        <CardTitle className="mb-1">Senior Frontend Developer</CardTitle>
        <CardDescription>TechCorp Inc.</CardDescription>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-1">
        <MapPin className="w-4 h-4" />
        <span>San Francisco, CA</span>
      </div>
      <div className="flex items-center gap-1">
        <DollarSign className="w-4 h-4" />
        <span>$120k - $160k</span>
      </div>
    </div>
    <div className="flex gap-2 mt-4">
      <Badge>Full-time</Badge>
      <Badge variant="outline">Senior</Badge>
    </div>
  </CardContent>
  <CardFooter>
    <Button className="w-full">Apply Now</Button>
  </CardFooter>
</Card>
```

---

## ⚙️ DESIGN PRINCIPLES

1. **Consistency**: Sử dụng cùng spacing, colors, typography trong toàn bộ app
2. **Simplicity**: Giữ UI đơn giản, tránh phức tạp hóa
3. **Accessibility**: Đảm bảo contrast ratio tốt, font size đủ lớn
4. **Responsive**: Mobile-first approach, responsive trên mọi kích thước
5. **Hierarchy**: Sử dụng size, weight, color để tạo visual hierarchy
6. **Spacing**: Breathing room giữa các elements
7. **Feedback**: Hover states, loading states, error states rõ ràng

---

## 📱 RESPONSIVE BREAKPOINTS

```css
sm: 640px    /* Tablet nhỏ */
md: 768px    /* Tablet */
lg: 1024px   /* Desktop */
xl: 1280px   /* Desktop lớn */
2xl: 1536px  /* Desktop rất lớn */
```

**Usage:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 cột mobile, 2 cột tablet, 3 cột desktop */}
</div>
```

---

## 🎨 ACCESSIBILITY

### Color Contrast
- Text chính trên background: >= 4.5:1
- Large text (18px+): >= 3:1
- Interactive elements: Contrast tốt

### Focus States
- Tất cả interactive elements phải có focus ring
- Focus ring: `outline-ring/50`

### Semantic HTML
- Sử dụng đúng tags: `<button>`, `<a>`, `<h1>`, `<nav>`
- Labels cho form fields
- Alt text cho images

---

**Tài liệu này được cập nhật:** May 2026  
**Version:** 1.0  
**Project:** JobHunter - Job Recruitment Platform
