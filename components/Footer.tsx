import { Icon } from '@makerdao/dai-ui-icons'
// import { LanguageSelect } from 'components/LanguageSelect'
import { AppLink } from 'components/Links'
import { NewsletterSection } from 'features/newsletter/NewsletterView'
import { staticFilesRuntimeUrl } from 'helpers/staticPaths'
import moment from 'moment'
import { useTranslation } from 'next-i18next'
import getConfig from 'next/config'
import React from 'react'
import { Box, Container, Flex, Grid, Image, Link, Text } from 'theme-ui'

const {
  publicRuntimeConfig: { buildHash, buildDate, showBuildInfo },
} = getConfig()
//@GSUpro add links
const ROUTES = {
  // CONTACT: `${apiHost}/daiwallet/contact`,
  CONTACT: `/inprogress`,
  SUPPORT: '/support',
  TWITTER: ' https://twitter.com/GSUcoin',
  DISCORD: 'https://discord.com/invite/cm3tmM37W3',
}
//@GSUpro add links ends
//@GSUpro add links
const FOOTER_SECTIONS = [
  {
    titleKey: 'nav.about',
    links: [
      // { labelKey: 'nav.team', url: '/about' },
      // { labelKey: 'nav.careers', url: '/careers' },
      { labelKey: 'nav.privacy', url: '/privacy' },
      { labelKey: 'nav.cookie', url: '/cookie' },
      { labelKey: 'nav.terms', url: '/terms' },
      // { labelKey: 'nav.contact', url: `${apiHost}/daiwallet/contact` },
      { labelKey: 'nav.contact', url: `mailto:support@GSUcoin.app` },
    ],
  },
  {
    titleKey: 'nav.resources',
    links: [
      { labelKey: 'nav.blog', url: '/inprogress' },
      {
        labelKey: 'nav.faq',
        url: '/support',
      },
      // add link
      { labelKey: 'nav.knowledge-centre', url: '/inprogress' },
      { labelKey: 'nav.oracles', url: '/oracles' },
      // { labelKey: 'nav.referrals', url: '/referrals' },
    ],
  },
  {
    titleKey: 'nav.products',
    links: [
      {
        labelKey: 'nav.dai-wallet',
        // url: `${apiHost}/daiwallet`,
        url: `/inprogress`,
        target: '_self',
      },
      { labelKey: 'nav.borrow', url: '/borrow' },
      // { labelKey: 'nav.multiply', url: '/multiply' },
    ],
  },
  //@GSUpro remove links ends
]

export function TemporaryFooter() {
  const commit = buildHash.substring(0, 10)
  const date = moment(buildDate).format('DD.MM.YYYY HH:MM')
  console.debug(`Build commit: ${commit} Build date: ${date}`)
  return (
    showBuildInfo && (
      <Container sx={{ maxWidth: '898px' }}>
        <Grid sx={{ color: 'text', fontSize: 2 }} columns={2}>
          <Text>
            Commit:{' '}
            <Link
              href={`https://github.com/gsu-protocol/oasis-borrow/commit/${buildHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {commit}
            </Link>
          </Text>
          <Text>Build Date: {date}</Text>
        </Grid>
      </Container>
    )
  )
}

function SocialWithLogo() {
  return (
    <Grid gap={3}>
      <Image src={staticFilesRuntimeUrl('/static/img/logo-footer.svg')} sx={{ height: '27px' }} />
      <Flex sx={{ alignItems: 'center', a: { fontSize: '0px' }, my: 2 }}>
        <AppLink href={ROUTES.TWITTER}>
          <Icon name="twitter" size="auto" width="18px" height="16px" />
        </AppLink>
        <AppLink href={ROUTES.DISCORD} sx={{ mx: 3 }}>
          <Icon name="discord" size="auto" width="20px" height="23px" />
        </AppLink>
        {/*@GSUpro add github*/}
        <AppLink href="https://github.com/gsu-protocol">
          <Icon name="github" size="auto" width="21px" />
        </AppLink>
        {/*@GSUpro add github end*/}
      </Flex>
      <Flex sx={{ justifyContent: ['center', 'flex-start'] }}>
        {/* <LanguageSelect components={LangSelectComponents} /> */}
      </Flex>
    </Grid>
  )
}

export function Footer() {
  const { t } = useTranslation()

  return (
    <Box as="footer" sx={{ position: 'relative', zIndex: 'footer' }}>
      <Container sx={{ maxWidth: '1200px', mb: 5, pb: 0, pt: 2 }}>
        <Grid
          sx={{
            pl: 0,
            alignItems: 'flex-start',
            justifyItems: ['flex-start', 'center'],
          }}
          columns={[2, '150px 1fr 1fr 1fr', '150px 1fr 1fr 1fr 378px']}
          gap={[4, null, 5]}
        >
          <Box sx={{ display: ['none', 'block'] }}>
            <SocialWithLogo />
          </Box>
          {FOOTER_SECTIONS.map(({ titleKey, links }) => (
            <Grid key={titleKey} as="ul" pl={0}>
              <Text sx={{ fontSize: 4, fontWeight: 'semiBold' }}>{t(titleKey)}</Text>
              {links.map(({ labelKey, url, target }) => (
                <Box key={labelKey} as="li" sx={{ listStyle: 'none' }}>
                  <AppLink variant="navFooter" href={url} target={target}>
                    {t(labelKey)}
                  </AppLink>
                </Box>
              ))}
            </Grid>
          ))}

          <Box sx={{ display: ['none', 'none', 'flex'], width: '100%' }}>
            <NewsletterSection small />
          </Box>
        </Grid>
        <Flex sx={{ display: ['flex', 'flex', 'none'], mt: 5 }}>
          <NewsletterSection small />
        </Flex>
        <Flex sx={{ justifyContent: 'center', pt: 5, display: ['flex', 'none'] }}>
          <SocialWithLogo />
        </Flex>
      </Container>
      <TemporaryFooter />
    </Box>
  )
}
