<template>
  <div class="container mx-auto px-6 py-16 max-w-5xl">
    <h1 class="page-title">Design System</h1>
    <p class="page-subtitle mb-16">Available components</p>

    <!-- ==================== TYPOGRAPHY ==================== -->
    <section class="mb-20">
      <h2 class="section-title-lg text-black border-b-2 border-black pb-2 mb-8">Typography</h2>

      <div class="space-y-6">
        <div>
          <span class="text-xs text-gray-400 font-mono">.page-title</span>
          <h1 class="page-title">Page Title</h1>
        </div>
        <div>
          <span class="text-xs text-gray-400 font-mono">.page-subtitle</span>
          <p class="page-subtitle">Page subtitle text for descriptions</p>
        </div>
        <div>
          <span class="text-xs text-gray-400 font-mono">.section-title-lg</span>
          <h2 class="section-title-lg text-black">Section Title Large</h2>
        </div>
        <div>
          <span class="text-xs text-gray-400 font-mono">.section-title</span>
          <h2 class="section-title">Section Title</h2>
        </div>
        <div>
          <span class="text-xs text-gray-400 font-mono">.form-title</span>
          <h2 class="form-title">Form Title</h2>
        </div>
        <div>
          <span class="text-xs text-gray-400 font-mono">.item-title</span>
          <h3 class="item-title">Item Title</h3>
        </div>
        <div>
          <span class="text-xs text-gray-400 font-mono">.card-title</span>
          <h3 class="card-title">Card Title</h3>
        </div>
        <div>
          <span class="text-xs text-gray-400 font-mono">.body-text</span>
          <p class="body-text">Body text for regular content paragraphs. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
        <div>
          <span class="text-xs text-gray-400 font-mono">.body-text-lg</span>
          <p class="body-text-lg">Large body text for emphasis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>
    </section>

    <!-- ==================== COLORS ==================== -->
    <section class="mb-20">
      <h2 class="section-title-lg text-black border-b-2 border-black pb-2 mb-8">Colors</h2>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div class="h-20 bg-black border-2 border-black mb-2"></div>
          <p class="text-sm font-medium">Black</p>
          <p class="text-xs text-gray-500">Primary / Text</p>
        </div>
        <div>
          <div class="h-20 bg-white border-2 border-black mb-2"></div>
          <p class="text-sm font-medium">White</p>
          <p class="text-xs text-gray-500">Background</p>
        </div>
        <div>
          <div class="h-20 bg-gray-50 border-2 border-gray-200 mb-2"></div>
          <p class="text-sm font-medium">Gray 50</p>
          <p class="text-xs text-gray-500">Alt Background</p>
        </div>
        <div>
          <div class="h-20 bg-gray-500 border-2 border-gray-500 mb-2"></div>
          <p class="text-sm font-medium">Gray 500</p>
          <p class="text-xs text-gray-500">Muted Text</p>
        </div>
        <div>
          <div class="h-20 bg-green-100 border-2 border-green-300 mb-2"></div>
          <p class="text-sm font-medium">Green</p>
          <p class="text-xs text-gray-500">Success</p>
        </div>
        <div>
          <div class="h-20 bg-yellow-100 border-2 border-yellow-300 mb-2"></div>
          <p class="text-sm font-medium">Yellow</p>
          <p class="text-xs text-gray-500">Warning</p>
        </div>
        <div>
          <div class="h-20 bg-red-100 border-2 border-red-300 mb-2"></div>
          <p class="text-sm font-medium">Red</p>
          <p class="text-xs text-gray-500">Error</p>
        </div>
        <div>
          <div class="h-20 bg-blue-100 border-2 border-blue-300 mb-2"></div>
          <p class="text-sm font-medium">Blue</p>
          <p class="text-xs text-gray-500">Info</p>
        </div>
      </div>
    </section>

    <!-- ==================== BUTTONS ==================== -->
    <section class="mb-20">
      <h2 class="section-title-lg text-black border-b-2 border-black pb-2 mb-8">Button</h2>

      <!-- Variants -->
      <h3 class="font-bold text-lg mb-4">Variants</h3>
      <div class="flex flex-wrap gap-4 mb-8">
        <Button variant="default">Default</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>

      <!-- With icons -->
      <h3 class="font-bold text-lg mb-4">With Icons</h3>
      <div class="flex flex-wrap gap-4 mb-8">
        <Button variant="primary" icon="ArrowLeft">Left Icon</Button>
        <Button variant="primary" rightIcon="MoveRight">Right Icon</Button>
        <Button variant="default" icon="ArrowLeft" rightIcon="MoveRight">Both Icons</Button>
      </div>

      <!-- States -->
      <h3 class="font-bold text-lg mb-4">States</h3>
      <div class="flex flex-wrap gap-4 mb-8">
        <Button variant="primary" :loading="true">Loading</Button>
        <Button variant="primary" :disabled="true">Disabled</Button>
        <Button variant="default" :disabled="true">Disabled Default</Button>
      </div>

      <!-- Icon only -->
      <h3 class="font-bold text-lg mb-4">Icon Only</h3>
      <div class="flex flex-wrap gap-4">
        <Button variant="default" icon="Settings" :iconOnly="true" />
        <Button variant="primary" icon="Plus" :iconOnly="true" />
        <Button variant="ghost" icon="X" :iconOnly="true" />
      </div>
    </section>

    <!-- ==================== ICONS ==================== -->
    <section class="mb-20">
      <h2 class="section-title-lg text-black border-b-2 border-black pb-2 mb-8">IconLucid</h2>

      <!-- Sizes -->
      <h3 class="font-bold text-lg mb-4">Sizes</h3>
      <div class="flex items-end gap-6 mb-8">
        <div class="text-center">
          <IconLucid name="Star" size="xs" />
          <p class="text-xs text-gray-500 mt-2">xs</p>
        </div>
        <div class="text-center">
          <IconLucid name="Star" size="sm" />
          <p class="text-xs text-gray-500 mt-2">sm</p>
        </div>
        <div class="text-center">
          <IconLucid name="Star" size="md" />
          <p class="text-xs text-gray-500 mt-2">md</p>
        </div>
        <div class="text-center">
          <IconLucid name="Star" size="lg" />
          <p class="text-xs text-gray-500 mt-2">lg</p>
        </div>
      </div>

      <!-- Sample icons -->
      <h3 class="font-bold text-lg mb-4">Available Icons (sample)</h3>
      <div class="grid grid-cols-4 md:grid-cols-8 gap-4">
        <div v-for="iconName in sampleIcons" :key="iconName" class="flex flex-col items-center gap-1 p-3 border border-gray-200">
          <IconLucid :name="iconName" size="md" />
          <span class="text-[10px] text-gray-500 text-center">{{ iconName }}</span>
        </div>
      </div>
    </section>

    <!-- ==================== CARD ==================== -->
    <section class="mb-20">
      <h2 class="section-title-lg text-black border-b-2 border-black pb-2 mb-8">Card</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card variant="standard">
          <h3 class="font-bold text-lg mb-2">Standard</h3>
          <p class="text-gray-600 text-sm">Default card with black border and shadow.</p>
        </Card>

        <Card variant="featured">
          <h3 class="font-bold text-lg mb-2">Featured</h3>
          <p class="text-gray-600 text-sm">Thicker border for emphasis.</p>
        </Card>

        <Card variant="success">
          <h3 class="font-bold text-lg mb-2">Success</h3>
          <p class="text-gray-600 text-sm">Green variant for positive states.</p>
        </Card>

        <Card variant="warning">
          <h3 class="font-bold text-lg mb-2">Warning</h3>
          <p class="text-gray-600 text-sm">Yellow variant for caution states.</p>
        </Card>

        <Card variant="muted">
          <h3 class="font-bold text-lg mb-2">Muted</h3>
          <p class="text-gray-600 text-sm">Subtle card for secondary content.</p>
        </Card>

        <Card variant="standard" :noShadow="true">
          <h3 class="font-bold text-lg mb-2">No Shadow</h3>
          <p class="text-gray-600 text-sm">Standard card without shadow.</p>
        </Card>
      </div>
    </section>

    <!-- ==================== TAG ==================== -->
    <section class="mb-20">
      <h2 class="section-title-lg text-black border-b-2 border-black pb-2 mb-8">Tag</h2>

      <div class="flex flex-wrap gap-3 mb-6">
        <Tag variant="default">Default</Tag>
        <Tag variant="primary">Primary</Tag>
        <Tag variant="success">Success</Tag>
        <Tag variant="warning">Warning</Tag>
        <Tag variant="error">Error</Tag>
        <Tag variant="info">Info</Tag>
        <Tag variant="violet">Violet</Tag>
        <Tag variant="selection">Selection</Tag>
        <Tag variant="completed">Completed</Tag>
      </div>

      <h3 class="font-bold text-lg mb-4">With Icons</h3>
      <div class="flex flex-wrap gap-3">
        <Tag variant="success" icon="Check">Completed</Tag>
        <Tag variant="warning" icon="Clock">Pending</Tag>
        <Tag variant="error" icon="X">Cancelled</Tag>
        <Tag variant="info" icon="Calendar">Active</Tag>
      </div>
    </section>

    <!-- ==================== INFO NOTE ==================== -->
    <section class="mb-20">
      <h2 class="section-title-lg text-black border-b-2 border-black pb-2 mb-8">InfoNote</h2>

      <div class="space-y-4">
        <InfoNote>Default note with helpful information for the user.</InfoNote>
        <InfoNote variant="info">Info variant with blue accent for informational content.</InfoNote>
        <InfoNote variant="warning">Warning variant with yellow accent for cautionary messages.</InfoNote>
        <InfoNote variant="success">Success variant with green accent for positive feedback.</InfoNote>
      </div>
    </section>

    <!-- ==================== STATUS ICON ==================== -->
    <section class="mb-20">
      <h2 class="section-title-lg text-black border-b-2 border-black pb-2 mb-8">StatusIcon</h2>

      <div class="flex flex-wrap gap-8 items-end">
        <div class="text-center">
          <StatusIcon type="success" size="md" />
          <p class="text-sm text-gray-500 mt-3">Success</p>
        </div>
        <div class="text-center">
          <StatusIcon type="error" size="md" />
          <p class="text-sm text-gray-500 mt-3">Error</p>
        </div>
        <div class="text-center">
          <StatusIcon type="warning" size="md" />
          <p class="text-sm text-gray-500 mt-3">Warning</p>
        </div>
        <div class="text-center">
          <StatusIcon type="info" size="md" />
          <p class="text-sm text-gray-500 mt-3">Info</p>
        </div>
      </div>

      <h3 class="font-bold text-lg mt-8 mb-4">Sizes</h3>
      <div class="flex flex-wrap gap-8 items-end">
        <div class="text-center">
          <StatusIcon type="success" size="sm" />
          <p class="text-sm text-gray-500 mt-3">Small</p>
        </div>
        <div class="text-center">
          <StatusIcon type="success" size="md" />
          <p class="text-sm text-gray-500 mt-3">Medium</p>
        </div>
        <div class="text-center">
          <StatusIcon type="success" size="lg" />
          <p class="text-sm text-gray-500 mt-3">Large</p>
        </div>
      </div>
    </section>

    <!-- ==================== FORMS ==================== -->
    <section class="mb-20">
      <h2 class="section-title-lg text-black border-b-2 border-black pb-2 mb-8">Forms</h2>

      <div class="max-w-md space-y-6">
        <!-- Input -->
        <h3 class="font-bold text-lg mb-4">Input</h3>
        <Input
          v-model="demoText"
          type="text"
          label="Text Input"
          placeholder="Type something..."
        />
        <Input
          v-model="demoEmail"
          type="email"
          label="Email Input"
          placeholder="you@example.com"
          hint="We will never share your email."
        />
        <Input
          v-model="demoError"
          type="text"
          label="With Error"
          placeholder="Invalid value"
          error="This field is required"
        />
        <Input
          v-model="demoDisabled"
          type="text"
          label="Disabled"
          placeholder="Cannot edit"
          :disabled="true"
        />

        <!-- Select -->
        <h3 class="font-bold text-lg mt-8 mb-4">Select</h3>
        <Select
          v-model="demoSelect"
          :options="selectOptions"
          label="Select an option"
          placeholder="Choose..."
        />
        <Select
          v-model="demoSelectError"
          :options="selectOptions"
          label="With Error"
          placeholder="Choose..."
          error="Please select an option"
        />
        <Select
          v-model="demoSelectDisabled"
          :options="selectOptions"
          label="Disabled"
          placeholder="Choose..."
          :disabled="true"
        />
      </div>
    </section>

    <!-- ==================== BLOCK QUOTE ==================== -->
    <section class="mb-20">
      <h2 class="section-title-lg text-black border-b-2 border-black pb-2 mb-8">BlockQuote</h2>

      <BlockQuote
        quote="Design is not just what it looks like and feels like. Design is how it works."
        author="Steve Jobs"
      />
    </section>

    <!-- ==================== FAQ ==================== -->
    <section class="mb-20">
      <h2 class="section-title-lg text-black border-b-2 border-black pb-2 mb-8">FAQ</h2>

      <div class="max-w-2xl">
        <FAQ :items="faqItems" />
      </div>
    </section>

    <!-- ==================== PROGRESS BAR ==================== -->
    <section class="mb-20">
      <h2 class="section-title-lg text-black border-b-2 border-black pb-2 mb-8">ProgressBar</h2>

      <div class="max-w-md space-y-6">
        <div>
          <p class="text-sm text-gray-600 mb-2">25%</p>
          <ProgressBar :value="25" />
        </div>
        <div>
          <p class="text-sm text-gray-600 mb-2">50%</p>
          <ProgressBar :value="50" />
        </div>
        <div>
          <p class="text-sm text-gray-600 mb-2">75%</p>
          <ProgressBar :value="75" />
        </div>
        <div>
          <p class="text-sm text-gray-600 mb-2">100%</p>
          <ProgressBar :value="100" />
        </div>
      </div>
    </section>

    <!-- ==================== FEATURE LIST ==================== -->
    <section class="mb-20">
      <h2 class="section-title-lg text-black border-b-2 border-black pb-2 mb-8">FeatureList</h2>

      <div class="max-w-md">
        <FeatureList :items="['Feature one included', 'Feature two included', 'Feature three included']" />
      </div>
    </section>

    <!-- ==================== STEP INDICATOR ==================== -->
    <section class="mb-20">
      <h2 class="section-title-lg text-black border-b-2 border-black pb-2 mb-8">StepIndicator</h2>

      <div class="max-w-lg">
        <StepIndicator
          :steps="stepItems"
          currentStatus="in_progress"
        />
      </div>
    </section>

    <!-- ==================== OPTION BUTTON ==================== -->
    <section class="mb-20">
      <h2 class="section-title-lg text-black border-b-2 border-black pb-2 mb-8">OptionButton</h2>

      <div class="max-w-md space-y-3">
        <OptionButton
          label="Option A"
          sublabel="Description for option A"
          icon="Zap"
          :selected="selectedOption === 'a'"
          @click="selectedOption = 'a'"
        />
        <OptionButton
          label="Option B"
          sublabel="Description for option B"
          hint="Recommended"
          icon="Shield"
          badge="Popular"
          :selected="selectedOption === 'b'"
          @click="selectedOption = 'b'"
        />
        <OptionButton
          label="Option C"
          sublabel="Description for option C"
          icon="Target"
          :selected="selectedOption === 'c'"
          @click="selectedOption = 'c'"
        />
      </div>
    </section>

    <!-- Back -->
    <div class="mt-12">
      <Button variant="ghost" icon="ArrowLeft" :to="localePath('/')">
        Back to home
      </Button>
    </div>
  </div>
</template>

<script setup>
const localePath = useLocalePath();

// Demo form state
const demoText = ref('');
const demoEmail = ref('');
const demoError = ref('');
const demoDisabled = ref('Disabled value');
const demoSelect = ref('');
const demoSelectError = ref('');
const demoSelectDisabled = ref('');

const selectOptions = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
];

// Demo FAQ items
const faqItems = [
  { question: 'What is this design system?', answer: 'A collection of reusable components built with Tailwind CSS following a neo-brutalist aesthetic with bold borders, offset shadows, and high contrast.' },
  { question: 'How do I use the components?', answer: 'All components are auto-imported by Nuxt. Simply use them in your templates by their name, e.g. <Button>, <Card>, <Tag>.' },
  { question: 'Can I customize the styles?', answer: 'Yes. All components use Tailwind utility classes and accept additional classes via the class attribute. You can override styles as needed.' },
];

// Demo step indicator
const stepItems = [
  { status: 'done', label: 'Step 1', shortLabel: 'Step 1' },
  { status: 'in_progress', label: 'Step 2', shortLabel: 'Step 2' },
  { status: 'pending', label: 'Step 3', shortLabel: 'Step 3' },
  { status: 'future', label: 'Step 4', shortLabel: 'Step 4' },
];

// Demo option button
const selectedOption = ref('b');

// Sample icons for the icon gallery
const sampleIcons = [
  'Zap', 'Shield', 'Target', 'Star', 'Check', 'X', 'Plus', 'Settings',
  'User', 'Mail', 'Calendar', 'Clock', 'Globe', 'Info', 'Package', 'Download',
];

useHead({
  title: 'Design System',
});
</script>
