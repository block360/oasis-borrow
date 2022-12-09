import { Icon } from '@makerdao/dai-ui-icons'
// @ts-ignore
import MDX from '@mdx-js/runtime'
import { PageSEOTags } from 'components/HeadTags'
import { MarketingLayout } from 'components/Layouts'
import { AppLink } from 'components/Links'
import { currentContent } from 'features/content'
import {
  ContentNavigation,
  ContentQuestion,
  ContentTypeSupport,
} from 'features/content/support/support'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React, { useState } from 'react'
import { TRANSITIONS } from 'theme'
import { Box, Flex, Heading } from 'theme-ui'

function Question({ question, answer }: ContentQuestion) {
  const [opened, setOpened] = useState(false)

  return (
    <Box
      sx={{
        borderBottom: 'light',
        mb: 3,
        py: 1,
        '&:last-child': {
          border: 'none',
        },
      }}
    >
      <Flex
        sx={{
          mb: 3,
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: TRANSITIONS.global,
          '&:hover': {
            color: 'primary60',
          },
        }}
        onClick={() => setOpened(!opened)}
      >
        <Heading variant="paragraph1" sx={{ color: 'primary100', fontWeight: 'heading' }}>
          {question}
        </Heading>
        <Icon name={opened ? 'support_minus' : 'support_plus'} size="auto" width="21px" />
      </Flex>
      {opened && (
        <Box
          sx={{
            mb: 3,
            a: {
              color: 'primary100',
              textDecoration: 'underline',
            },
            p: {
              color: 'primary100',
            },
          }}
        >
          <MDX>{answer}</MDX>
        </Box>
      )}
    </Box>
  )
}

function Navigation({ navigation }: { navigation: ContentNavigation[] }) {
  return (
    <Flex
      sx={{
        alignItems: 'center',
        //@GSUpro fixes styles
        justifyContent: ['center', 'center', 'center', 'start'],
        flexDirection: ['column', 'column', 'column', 'row'],
        //@GSUpro fixes styles end
      }}
    >
      {navigation.map(({ title, id }) => (
        <AppLink
          href="/support"
          hash={id}
          key={id}
          sx={{
            //@GSUpro fixes styles
            mr: [0, 3],
            textDecoration: 'none',
            fontSize: 2,
            fontWeight: 600,
            //@GSUpro fixes styles end
            color: 'primary60',
            cursor: 'pointer',
            position: 'relative',
            '&:hover': {
              color: 'primary100',
            },
            '&:before': {
              display: 'block',
              content: '""',
              position: 'absolute',
              width: '4px',
              height: '4px',
              bg: 'transparent',
              right: -3,
              top: '50%',
              borderRadius: '50%',
              transform: 'translate(50%, -50%)',
            },
            '&:last-child': {
              '&:before': {
                display: ['block', 'none'],
              },
            },
          }}
        >
          {title}
        </AppLink>
      ))}
    </Flex>
  )
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
})

function SupportPage() {
  const {
    i18n: { language },
  } = useTranslation()

  const { title, navigation, sections, cantFind, contactLink } = currentContent.support.content[
    language || 'en'
  ] as ContentTypeSupport

  return (
    <Box sx={{ width: '100%' }}>
      <Heading variant="header2" sx={{ textAlign: 'center', mb: 4 }}>
        {title}
      </Heading>
      <Navigation {...{ navigation }} />
      {sections.map(({ title, id, questions }) => (
        <Box key={id} sx={{ mt: 5, pt: 3 }} id={id}>
          <Heading variant="header2" sx={{ mb: 4 }}>
            {title}
          </Heading>
          {questions.map((question, i) => (
            <Question {...{ ...question, key: i }} />
          ))}
        </Box>
      ))}
      <Box mt={6} mb={5} sx={{ textAlign: 'center' }}>
        {cantFind}
        <AppLink
          //@GSUpro updates link
          href={`mailto:support@gsucoin.app`}
          //@GSUpro updates link end
          sx={{ color: 'primary100', textDecoration: 'underline', ml: 1 }}
        >
          {contactLink}
        </AppLink>
      </Box>
    </Box>
  )
}

SupportPage.layout = MarketingLayout
SupportPage.layoutProps = {
  variant: 'termsContainer',
  topBackground: 'none',
}
SupportPage.seoTags = (
  <PageSEOTags title="seo.support.title" description="seo.support.description" url="/support" />
)

export default SupportPage
