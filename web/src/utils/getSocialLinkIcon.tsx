import { FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi'

export const getSocialLinkIcon = (type: 'facebook' | 'instagram' | 'twitter') => {
  if (type === 'facebook') {
    return <FiFacebook color="#FFFFFF" />;
  }

  if (type === 'instagram') {
    return <FiInstagram color="#FFFFFF" />
  }

  return <FiTwitter color="#FFFFFF" />;
}