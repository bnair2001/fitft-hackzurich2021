from deta import Deta

deta = Deta('a0x1jx6b_jfNGLXs45J4JUDKne7E8tSBWhcFgu4wD')

users = deta.Base('users')
assets = deta.Base('nfts')
connections = deta.Base('connections')