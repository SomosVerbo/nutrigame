# -*- coding: utf-8 -*-
"""Gerador de pixel-art da clínica (NutriGame 2.5D). 32px tiles + Ana 4 direções."""
import os
from PIL import Image, ImageDraw

OUT = os.path.join(os.path.dirname(__file__), "clinic")
os.makedirs(OUT, exist_ok=True)
T = 32  # tile size

# ---- Paleta ----
def C(h, a=255):
    h = h.lstrip('#'); return (int(h[0:2],16), int(h[2:4],16), int(h[4:6],16), a)

OUTL = C('2b2f38')         # contorno
# piso clinico neutro (cinza claro, estilo referencia) — tons de ala bem sutis
FLOOR = C('e7ecf0'); FLOOR_D = C('d6dde4'); GROUT = C('c7d0d8')
ROSE = C('f1e8ed'); ROSE_D = C('e2d4dd')   # ala Gástrica/Fito (rosa suave)
BLUE = C('e5edf5'); BLUE_D = C('d1dfeb')   # ala Bioquímica (azul suave)
WALL = C('cfd6de'); WALL_D = C('b3bcc7'); WALL_TOP = C('e6eaef')
# parede de fundo alta (2.5D): faixa clara em cima + lambri verde-agua + molduras
WALL_HI = C('eef3f7'); WALL_HI_D = C('dde6ec')
WAINS = C('cfe2e3'); WAINS_D = C('b4cdcf'); WAINS_LN = C('a6c4c6')
CROWN = C('aeb9c4'); CROWN_LT = C('c8d1da'); BASEB = C('94a0ac')
WALL_FACE = 18  # quanto a parede de fundo sobe acima do tile (face visivel)
WALL_TOTAL = T + WALL_FACE  # altura do sprite da parede de fundo
WHITE = C('ffffff'); COATSH = C('e3e7ec')
SKIN = C('f4cda4'); SKIN_D = C('e3b489')
HAIR = C('d9b06a'); HAIR_D = C('c0934d'); HAIRLT = C('ecd29a')
NAVY = C('2b2b3a'); TEAL = C('46b3a6'); TEAL_D = C('349184')
METAL = C('b8c0c9'); METAL_D = C('919aa4')
SHADOW = C('000000', 60)

def newimg(w=T, h=T):
    return Image.new('RGBA', (w, h), (0,0,0,0))

def rrect(d, box, fill, outline=None):
    d.rectangle(box, fill=fill, outline=outline)

# ---- helpers de cor/sombreamento (qualidade de textura) ----
def sc(c, f):
    """Escala (clareia/escurece) uma cor mantendo o alfa."""
    return (max(0,min(255,int(c[0]*f))), max(0,min(255,int(c[1]*f))), max(0,min(255,int(c[2]*f))), c[3])
def mix(a, b, t):
    return (int(a[0]+(b[0]-a[0])*t), int(a[1]+(b[1]-a[1])*t), int(a[2]+(b[2]-a[2])*t), 255)

# ---------- TILES ----------
def floor_tile(base, dark):
    """Piso cerâmico estilo LimeZu: ladrilhos 16px com bisel (luz no topo/esq,
    sombra/junta embaixo/dir) + textura sutil pontilhada. Borda do tile = junta
    para emendar perfeitamente com os tiles vizinhos."""
    im = newimg(); d = ImageDraw.Draw(im)
    light = sc(base, 1.035); ao = sc(base, 0.955); grout = sc(base, 0.90); spk = sc(base, 0.97)
    d.rectangle([0, 0, T-1, T-1], fill=base)
    # textura sutil (pontos determinísticos, baixíssimo contraste)
    for (x, y) in [(3,5),(11,2),(6,12),(13,9),(2,14),(9,7),
                   (19,4),(27,7),(22,13),(30,11),(18,14),(25,2),
                   (4,21),(12,28),(7,18),(14,25),(2,30),(10,17),
                   (20,22),(28,26),(23,18),(30,29),(19,30),(26,20)]:
        d.point((x, y), fill=spk if (x + y) % 2 else light)
    # 4 ladrilhos de 16px com bisel
    for ox in (0, 16):
        for oy in (0, 16):
            d.line([ox, oy, ox+15, oy], fill=light)        # luz topo
            d.line([ox, oy, ox, oy+15], fill=light)        # luz esquerda
            d.line([ox, oy+15, ox+15, oy+15], fill=ao)     # sombra base
            d.line([ox+15, oy, ox+15, oy+15], fill=ao)     # sombra direita
    # juntas (seams) entre ladrilhos — coincidem com a borda do tile
    d.line([15, 0, 15, T-1], fill=grout)
    d.line([0, 15, T-1, 15], fill=grout)
    return im

def wall_back_tile():
    """Parede de fundo ALTA (face visivel) — visual 2.5D estilo LimeZu.
    Sprite 32 x WALL_TOTAL; a base encosta no piso, a face sobe WALL_FACE px."""
    im = newimg(T, WALL_TOTAL); d = ImageDraw.Draw(im)
    H = WALL_TOTAL
    waist = H - 19      # linha onde comeca o lambri
    floor = H - 4       # rodape / encontro com o chao
    # moldura de teto (crown) no topo, com leve volume
    d.rectangle([0,0,T-1,3], fill=CROWN)
    d.line([0,0,T-1,0], fill=CROWN_LT)
    d.line([0,2,T-1,2], fill=sc(CROWN,0.92))
    d.line([0,4,T-1,4], fill=C('8b96a1'))               # sombra sob o crown
    # face clara (gesso) com gradiente vertical sutil (mais luz no topo)
    for yy in range(5, waist+1):
        t = (yy-5)/max(1,(waist-5))
        d.line([0,yy,T-1,yy], fill=mix(WALL_HI, WALL_HI_D, t*0.7))
    for x in range(0,T,8): d.line([x,6,x,waist], fill=sc(WALL_HI_D,0.99))  # paineis sutis
    # cordao divisorio (chair rail) com relevo
    d.line([0,waist-1,T-1,waist-1], fill=C('ffffff'))
    d.line([0,waist,T-1,waist], fill=CROWN_LT)
    d.line([0,waist+1,T-1,waist+1], fill=WAINS_LN)
    # lambri inferior (azulejo verde-agua) com brilho no topo de cada azulejo
    d.rectangle([0,waist+2,T-1,floor-1], fill=WAINS)
    midln = (waist+2+floor-1)//2
    for x in range(0,T,8):
        d.line([x,waist+2,x,floor-1], fill=WAINS_D)                 # junta vertical
        d.line([x+1,waist+3,x+6,waist+3], fill=sc(WAINS,1.06))      # brilho topo do azulejo
        d.line([x+1,midln+1,x+6,midln+1], fill=sc(WAINS,1.06))
    d.line([0,midln,T-1,midln], fill=WAINS_D)                       # junta horizontal
    # sombra de contato (AO) logo acima do rodape
    d.line([0,floor-1,T-1,floor-1], fill=sc(WAINS,0.85))
    # rodape com brilho no topo
    d.rectangle([0,floor,T-1,H-1], fill=BASEB)
    d.line([0,floor,T-1,floor], fill=sc(BASEB,1.12))
    return im

def wall_side_tile():
    """Parede lateral/frontal plana (vista de cima) com leve relevo e textura."""
    im = newimg(); d = ImageDraw.Draw(im)
    # gradiente vertical sutil (mais claro em cima)
    for yy in range(T):
        t = yy/(T-1)
        d.line([0,yy,T-1,yy], fill=mix(sc(WALL,1.03), sc(WALL,0.96), t))
    d.rectangle([0,0,T-1,2], fill=WALL_TOP)            # brilho topo
    d.line([0,3,T-1,3], fill=sc(WALL,0.9))             # sombra sob o topo
    for x in range(0,T,8): d.line([x,4,x,T-6], fill=sc(WALL,0.97))  # painéis sutis
    d.line([0,15,T-1,15], fill=sc(WALL,0.93))          # junta horizontal
    d.rectangle([0,T-5,T-1,T-1], fill=WALL_D)          # rodape
    d.line([0,T-5,T-1,T-5], fill=sc(WALL_D,1.12))      # brilho do rodape
    return im

WALL_IN_FACE = 8  # face/altura das divisorias internas (mais baixas que a de fundo)
WALL_V_W = 12     # largura da parede vertical FINA (centralizada no tile)
def wall_v_tile():
    """Divisoria interna VERTICAL fina (corre N-S). Tile transparente dos lados
    p/ o piso aparecer — parede ~12px no centro. Desenhada com offset -WALL_IN_FACE."""
    H = T + WALL_IN_FACE
    im = newimg(T, H); d = ImageDraw.Draw(im)
    L = (T - WALL_V_W) // 2; R = L + WALL_V_W - 1
    d.rectangle([L, 0, R, H-1], fill=WALL_HI)          # corpo
    d.rectangle([L, 0, R, 2], fill=CROWN)              # cap superior
    d.line([L, 0, R, 0], fill=CROWN_LT)
    d.line([L, 3, R, 3], fill=WALL_HI_D)               # sombra sob o cap
    d.line([L, 4, L, H-2], fill=C('c4ccd4'))           # quina esq
    d.line([R, 4, R, H-2], fill=C('9aa6b2'))           # quina dir (mais escura)
    d.rectangle([L, H-3, R, H-1], fill=BASEB)          # base
    return im

def wall_h_tile():
    """Divisoria interna HORIZONTAL fina (corre L-O). Banda no meio do tile;
    piso aparece acima/abaixo. Desenhada com offset +8 (centralizada)."""
    im = newimg(T, 16); d = ImageDraw.Draw(im)
    d.rectangle([0, 3, T-1, 12], fill=WALL_HI)         # face
    d.rectangle([0, 0, T-1, 2], fill=CROWN)            # topo
    d.line([0, 0, T-1, 0], fill=CROWN_LT)
    d.line([0, 4, T-1, 4], fill=WALL_HI_D)
    d.rectangle([0, 13, T-1, 15], fill=BASEB)          # base/sombra
    return im

def bed_sprite():
    # leito 32x48 OBLIQUO (3/4): cabeceira ao fundo, pe da cama com FACE FRONTAL.
    im = newimg(T, 48); d = ImageDraw.Draw(im)
    # cabeceira acolchoada (painel vertical ao fundo)
    rrect(d, [3,1,28,3], METAL_D, OUTL)                # barra superior
    d.rounded_rectangle([4,3,27,9], radius=3, fill=C('cdd6df'), outline=OUTL)  # painel
    d.rounded_rectangle([6,4,25,7], radius=2, fill=C('e6eaef'))                # estofado/brilho
    d.line([6,5,24,5], fill=C('f4f7fa'))
    # grades laterais (volume 3D nas laterais) com brilho
    rrect(d, [2,7,4,40], METAL_D, OUTL); rrect(d, [27,7,29,40], METAL_D, OUTL)
    d.line([3,8,3,39], fill=C('d2d9e0')); d.line([28,8,28,39], fill=C('cfd6df'))
    # superficie do colchao (topo)
    rrect(d, [4,8,27,40], WHITE, OUTL)
    rrect(d, [4,8,27,11], COATSH)                      # sombra sob a cabeceira
    d.line([5,9,26,9], fill=C('f4f7fa'))
    # travesseiro com sombra
    d.rounded_rectangle([7,10,24,18], radius=3, fill=C('f6f8fb'), outline=OUTL)
    d.rounded_rectangle([8,11,23,14], radius=2, fill=C('ffffff'))
    d.line([7,18,24,18], fill=COATSH)                  # AO sob o travesseiro
    # cobertor em direcao a frente (será tingido por leito no jogo)
    rrect(d, [4,22,27,40], TEAL, OUTL)
    rrect(d, [4,22,27,26], TEAL_D)                     # dobra superior
    d.line([4,22,27,22], fill=C('5fc7ba'))             # brilho da dobra
    d.line([15,26,15,39], fill=TEAL_D)                 # vinco central
    d.line([10,30,10,39], fill=sc(TEAL,0.94)); d.line([21,30,21,39], fill=sc(TEAL,0.94))  # vincos
    d.line([4,33,27,33], fill=C('3da093'))
    # PE DA CAMA: face frontal vertical (o que da o 3D)
    rrect(d, [3,40,28,46], C('aeb8c2'), OUTL)          # face metal
    rrect(d, [3,40,28,42], C('d2d9e0'))                # topo do pe (brilho)
    d.line([3,46,28,46], fill=sc(C('aeb8c2'),0.82))    # AO base
    d.ellipse([5,44,9,47], fill=METAL_D, outline=OUTL); d.ellipse([22,44,26,47], fill=METAL_D, outline=OUTL)  # rodízios
    return im

def door_sprite():
    im = newimg(); d = ImageDraw.Draw(im)
    rrect(d, [4,1,27,T-1], C('8a6b4f'), OUTL)
    rrect(d, [6,3,25,T-1], C('a07f5e'))
    d.ellipse([20,15,23,18], fill=C('ffd54a'))     # maçaneta
    return im

def plant_sprite():
    im = newimg(); d = ImageDraw.Draw(im)
    d.ellipse([9,28,23,31], fill=SHADOW)                       # sombra
    # vaso com aro + terra
    rrect(d, [11,23,21,30], C('b5713f'), OUTL)
    rrect(d, [10,21,22,24], C('c8854f'), OUTL)                 # aro
    d.line([12,25,12,29], fill=C('d2a878'))                    # brilho
    d.rectangle([12,22,20,23], fill=C('5a3d28'))               # terra
    # folhagem em camadas (volume)
    g1 = C('2f8b50'); g2 = C('3ba35e'); g3 = C('57c074'); gl = C('80da9b')
    d.ellipse([6,8,18,22], fill=g1, outline=OUTL)
    d.ellipse([14,9,26,23], fill=g1, outline=OUTL)
    d.ellipse([10,3,22,16], fill=g2, outline=OUTL)
    d.ellipse([8,11,17,20], fill=g3)
    d.ellipse([16,12,24,20], fill=g3)
    d.ellipse([12,6,20,14], fill=gl)                           # brilho central
    d.line([12,18,14,11], fill=g1); d.line([20,18,18,10], fill=g1)  # veios
    d.point((14,8), fill=C('a8e8bd')); d.point((18,10), fill=C('a8e8bd'))
    return im

def desk_sprite():
    # escrivaninha OBLIQUA: tampo (topo) + face frontal com gavetas
    im = newimg(T, 24); d = ImageDraw.Draw(im)
    rrect(d, [2,7,29,11], C('dcb487'), OUTL)       # tampo (topo)
    rrect(d, [2,11,29,21], C('c79a6d'), OUTL)      # face frontal
    d.line([11,12,11,20], fill=C('a87f56')); d.line([21,12,21,20], fill=C('a87f56'))  # paineis
    d.rectangle([6,14,9,15], fill=C('8a6b4f')); d.rectangle([24,14,27,15], fill=C('8a6b4f'))  # puxadores
    rrect(d, [11,0,21,8], C('33414d'), OUTL)       # monitor
    rrect(d, [12,1,20,6], C('39c3cf'))
    return im

floor_tile(FLOOR, FLOOR_D).save(f"{OUT}/floor.png")
floor_tile(ROSE, ROSE_D).save(f"{OUT}/floor_rose.png")
floor_tile(BLUE, BLUE_D).save(f"{OUT}/floor_blue.png")

def wall_back_window():
    """Parede de fundo alta com janela ampla (ceu/jardim ao fundo)."""
    im = wall_back_tile(); d = ImageDraw.Draw(im)
    H = WALL_TOTAL; waist = H - 19
    fx0, fy0, fx1, fy1 = 5, 7, 26, waist - 3
    d.rectangle([fx0-1,fy0-1,fx1+1,fy1+1], fill=C('5d6a78'), outline=OUTL)  # moldura
    # vidro com degrade de ceu
    for yy in range(fy0, fy1):
        t = (yy - fy0) / max(1, (fy1 - fy0))
        col = (int(150+60*(1-t)), int(200+30*(1-t)), int(225+25*(1-t)), 255)
        d.line([fx0, yy, fx1, yy], fill=col)
    d.rectangle([fx0,fy0,fx0+9,fy0+7], fill=C('d3edf9'))   # reflexo
    midx = (fx0+fx1)//2; midy = (fy0+fy1)//2               # caixilho
    d.line([midx,fy0,midx,fy1], fill=C('5d6a78'))
    d.line([fx0,midy,fx1,midy], fill=C('5d6a78'))
    d.line([fx0,fy1-3,fx1,fy1-3], fill=C('bfe0d2'))        # peitoril verde (planta)
    return im

wall_back_tile().save(f"{OUT}/wall.png")
wall_side_tile().save(f"{OUT}/wall_base.png")
wall_back_window().save(f"{OUT}/wall_window.png")
wall_v_tile().save(f"{OUT}/wall_v.png")
wall_h_tile().save(f"{OUT}/wall_h.png")
bed_sprite().save(f"{OUT}/bed.png")
door_sprite().save(f"{OUT}/door.png")
plant_sprite().save(f"{OUT}/plant.png")
desk_sprite().save(f"{OUT}/desk.png")

def chair_sprite():
    # cadeira 3/4 com estofado: encosto, assento, face frontal e pernas
    im = newimg(); d = ImageDraw.Draw(im)
    back = C('5577b0'); back_l = C('7196cf'); seat = C('6a8cc7'); seat_f = C('45608f')
    rrect(d, [9,5,23,17], back, OUTL)             # encosto
    rrect(d, [10,6,22,9], back_l)                 # brilho do encosto
    d.line([10,15,22,15], fill=seat_f)            # vinco do estofado
    rrect(d, [9,17,23,23], seat, OUTL)            # assento (topo)
    d.rectangle([10,17,22,18], fill=back_l)       # brilho do assento
    rrect(d, [9,23,23,26], seat_f)                # face frontal
    rrect(d, [10,26,12,30], OUTL); rrect(d, [20,26,22,30], OUTL)  # pernas
    return im

def cabinet_sprite():
    # armario de medicamentos com 2 portas, macanetas, cruz e bisel
    im = newimg(); d = ImageDraw.Draw(im)
    body = C('eef1f4'); door = C('e6eaef'); sh = C('c2cad2'); hi = C('ffffff'); steel = C('9aa6b2')
    d.ellipse([5,28,27,31], fill=SHADOW)
    rrect(d, [5,3,26,30], body, OUTL)
    d.rectangle([5,3,26,4], fill=hi)              # brilho do topo
    d.rectangle([25,4,26,29], fill=sh)            # sombra lateral
    rrect(d, [6,5,15,28], door, C('b4bcc6'))      # porta esq
    rrect(d, [16,5,25,28], door, C('b4bcc6'))     # porta dir
    d.line([6,6,14,6], fill=hi); d.line([16,6,24,6], fill=hi)  # brilho das portas
    d.rectangle([14,14,15,18], fill=steel); d.rectangle([16,14,17,18], fill=steel)  # macanetas
    cross = C('d05a62')
    rrect(d, [13,9,18,12], cross); rrect(d, [14,8,17,13], cross)   # cruz (centro-topo)
    d.point((14,8), fill=C('e88a90'))
    d.rectangle([7,28,9,30], fill=steel); d.rectangle([22,28,24,30], fill=steel)  # pes
    return im

def cooler_sprite():
    # bebedouro: galao de agua + corpo + torneira
    im = newimg(); d = ImageDraw.Draw(im)
    base = C('dfe6ec'); sh = C('c2ccd4'); hi = C('ffffff')
    d.ellipse([9,28,23,31], fill=SHADOW)
    rrect(d, [11,13,21,30], base, OUTL)           # corpo
    d.rectangle([20,14,21,29], fill=sh)           # sombra lateral
    rrect(d, [12,4,20,14], C('a8d7f0'), OUTL)     # galao de agua
    d.ellipse([13,5,18,9], fill=C('cdebfb'))      # brilho/bolha
    d.line([12,17,20,17], fill=sh)                # vinco
    rrect(d, [14,20,18,24], C('5aa9d6'), OUTL)    # torneira
    d.point((15,21), fill=hi)
    return im

def rug_sprite():
    # tapete oval de recepção com anéis concêntricos (estilo acolhedor)
    im = newimg(); d = ImageDraw.Draw(im)
    d.ellipse([1,6,30,27], fill=C('a87fc0'), outline=OUTL)   # borda
    d.ellipse([3,8,28,25], fill=C('caa6d6'))
    d.ellipse([6,11,25,22], fill=C('b491c8'))
    d.ellipse([10,13,21,20], fill=C('d8c2e3'))
    d.ellipse([14,15,17,18], fill=C('a87fc0'))               # miolo
    return im

def screen_sprite():
    im = newimg(T, 48); d = ImageDraw.Draw(im)
    for i, x in enumerate([3,13,23]):
        rrect(d, [x,6,x+8,44], C('cfe8e4') if i % 2 else C('bfded8'), OUTL)
    return im

def poster_sprite():
    im = newimg(); d = ImageDraw.Draw(im)
    rrect(d, [7,5,24,27], C('8a6b4f'), OUTL)        # moldura
    rrect(d, [9,7,22,25], C('ffffff'))
    d.line([9,11,21,11], fill=C('d23b46')); d.line([9,15,21,15], fill=C('2bb6c4')); d.line([9,19,18,19], fill=C('46b56a'))
    return im

def clock_sprite():
    im = newimg(); d = ImageDraw.Draw(im)
    d.ellipse([8,6,23,21], fill=C('ffffff'), outline=OUTL)
    d.line([15,14,15,9], fill=OUTL); d.line([15,14,19,15], fill=OUTL)
    d.point((15,14), fill=C('d23b46'))
    return im

def ivstand_sprite():
    # suporte de soro 32x48, base no chao
    im = newimg(T, 48); d = ImageDraw.Draw(im)
    d.ellipse([11,43,23,47], fill=SHADOW)              # sombra
    d.ellipse([12,42,24,46], fill=METAL_D, outline=OUTL)  # base/rodizio
    d.line([18,11,18,44], fill=METAL_D); d.line([19,11,19,44], fill=METAL)  # haste
    d.line([18,11,11,11], fill=METAL_D)                # gancho
    rrect(d, [8,13,17,27], C('d5ecdb'), OUTL)          # bolsa de soro
    rrect(d, [9,14,16,19], C('aedcba'))                # liquido
    d.line([12,27,12,36], fill=C('cfd6df'))            # equipo
    return im

def cart_sprite():
    # carrinho de medicacao 32x40
    im = newimg(T, 40); d = ImageDraw.Draw(im)
    d.ellipse([5,35,27,39], fill=SHADOW)
    rrect(d, [4,9,28,35], C('e3e9ee'), OUTL)
    rrect(d, [4,9,28,13], C('cad3db'))                 # tampo
    d.line([4,21,28,21], fill=C('b4c0cb')); d.line([4,28,28,28], fill=C('b4c0cb'))  # gavetas
    d.rectangle([14,16,18,18], fill=METAL_D); d.rectangle([14,24,18,26], fill=METAL_D)  # alcas
    d.ellipse([6,34,11,39], fill=OUTL); d.ellipse([21,34,26,39], fill=OUTL)  # rodas
    rrect(d, [7,4,13,10], C('d23b46'), OUTL)           # itens no topo
    rrect(d, [17,5,24,10], C('46b56a'), OUTL)
    return im

def sidetable_sprite():
    # mesa de cabeceira: tampo + gaveta com bisel + copo d'agua
    im = newimg(T, 28); d = ImageDraw.Draw(im)
    top = C('e0c193'); face = C('c7a679'); sh = C('a98860'); hi = C('eed4ab'); steel = C('8a6b4f')
    d.ellipse([7,24,25,27], fill=SHADOW)
    rrect(d, [6,9,26,13], top, OUTL)                   # tampo
    d.line([7,9,25,9], fill=hi)                        # brilho do tampo
    rrect(d, [6,13,26,21], face, OUTL)                 # gaveta
    d.line([16,14,16,20], fill=sh)                     # divisao
    d.line([7,14,14,14], fill=hi); d.line([17,14,24,14], fill=hi)  # brilho das gavetas
    d.rectangle([10,16,12,17], fill=steel); d.rectangle([20,16,22,17], fill=steel)  # puxadores
    d.line([8,21,8,25], fill=steel); d.line([24,21,24,25], fill=steel)  # pernas
    rrect(d, [14,3,20,10], C('bfe3f2'), OUTL)          # copo de agua
    d.line([15,4,15,9], fill=C('e6f6fc'))              # brilho do copo
    return im

def curtain_sprite():
    # cortina/divisoria de box 32x44 pendurada no trilho
    im = newimg(T, 44); d = ImageDraw.Draw(im)
    d.rectangle([0,1,T-1,3], fill=METAL_D)             # trilho
    for i, x in enumerate(range(0, T, 4)):             # tecido com pregas
        col = C('bcd9e6') if i % 2 else C('a6cbdc')
        d.rectangle([x,4,x+3,41], fill=col)
    d.rectangle([0,4,T-1,6], fill=C('d2ecf4'))         # brilho do topo
    d.line([0,41,T-1,41], fill=C('8fb6c8'))            # barra inferior
    return im

def locker_sprite():
    # armario alto (vestiario) 32x44 com 2 portas, ventilacao, plaquetas e pes
    im = newimg(T, 44); d = ImageDraw.Draw(im)
    body = C('cfd9e2'); door = C('c4cfd9'); sh = C('a9b6c2'); hi = C('e6edf3'); steel = C('8a96a2')
    d.ellipse([6,39,26,43], fill=SHADOW)
    rrect(d, [5,2,27,40], body, OUTL)
    d.rectangle([5,2,27,3], fill=hi)                   # brilho do topo
    rrect(d, [6,4,15,38], door, sh)                    # porta esq
    rrect(d, [17,4,26,38], door, sh)                   # porta dir
    d.line([6,5,14,5], fill=hi); d.line([17,5,25,5], fill=hi)  # brilho das portas
    for vy in (8,11,14):                               # ventilacao (ranhuras)
        d.line([8,vy,13,vy], fill=sh); d.line([19,vy,24,vy], fill=sh)
    d.rectangle([13,20,14,24], fill=steel); d.rectangle([18,20,19,24], fill=steel)  # macanetas
    rrect(d, [8,28,12,32], C('f3e7b0'), sh); rrect(d, [19,28,23,32], C('f3e7b0'), sh)  # plaquetas
    d.rectangle([6,38,9,40], fill=steel); d.rectangle([23,38,26,40], fill=steel)       # pes
    return im

def cabinet_side_sprite():
    # armario visto DE LADO (perfil), encostado na parede — portas voltadas p/ a DIREITA.
    # (no jogo, a parede esquerda usa este; a direita usa o mesmo espelhado.)
    im = newimg(); d = ImageDraw.Draw(im)
    body = C('eef1f4'); door = C('e6eaef'); sh = C('c2cad2'); dk = C('aab4be'); hi = C('ffffff'); steel = C('9aa6b2')
    d.ellipse([6,28,22,31], fill=SHADOW)
    d.polygon([(9,4),(21,4),(18,1),(6,1)], fill=sh)     # topo em perspectiva (recua p/ a parede)
    rrect(d, [6,4,10,30], dk, OUTL)                     # lateral encostada na parede (faixa escura)
    rrect(d, [9,4,21,30], body, OUTL)                   # corpo (face frontal voltada à direita)
    d.rectangle([9,4,21,5], fill=hi)                    # brilho do topo
    rrect(d, [11,7,20,16], door, sh)                    # porta de cima
    rrect(d, [11,18,20,28], door, sh)                   # porta de baixo
    d.line([11,8,19,8], fill=hi)
    d.rectangle([18,10,19,14], fill=steel); d.rectangle([18,21,19,25], fill=steel)  # macanetas (borda da sala)
    cross = C('d05a62'); rrect(d, [13,7,17,9], cross); rrect(d, [14,6,16,10], cross) # cruz no topo
    d.rectangle([10,28,12,30], fill=steel); d.rectangle([18,28,20,30], fill=steel)  # pes
    return im

def locker_side_sprite():
    # locker/armario alto DE LADO (perfil) 32x44 — portas voltadas p/ a DIREITA.
    im = newimg(T, 44); d = ImageDraw.Draw(im)
    body = C('cfd9e2'); door = C('c4cfd9'); sh = C('a9b6c2'); dk = C('8f9aa6'); hi = C('e6edf3'); steel = C('8a96a2')
    d.ellipse([6,39,22,43], fill=SHADOW)
    d.polygon([(9,3),(21,3),(18,1),(6,1)], fill=sh)     # topo em perspectiva
    rrect(d, [6,3,10,40], dk, OUTL)                     # lateral encostada
    rrect(d, [9,2,21,40], body, OUTL)                   # face frontal
    d.rectangle([9,2,21,3], fill=hi)
    rrect(d, [11,5,20,37], door, sh)                    # porta inteira
    d.line([11,6,19,6], fill=hi)
    for vy in (9, 12, 15):                              # ventilacao
        d.line([12,vy,19,vy], fill=sh)
    d.rectangle([18,19,19,25], fill=steel)             # macaneta
    rrect(d, [12,28,18,33], C('f3e7b0'), sh)           # plaqueta
    d.rectangle([10,40,12,43], fill=steel); d.rectangle([18,40,20,43], fill=steel)  # pes
    return im

def bench_sprite():
    # banco de espera 32x24 (assentos coloridos)
    im = newimg(T, 24); d = ImageDraw.Draw(im)
    d.ellipse([3,20,29,23], fill=SHADOW)
    rrect(d, [3,11,29,18], C('5f6b7a'), OUTL)          # estrutura
    for i, x in enumerate([4,12,20]):                  # 3 assentos
        rrect(d, [x,7,x+7,13], C('6ab0c9') if i % 2 else C('e0a86b'), OUTL)
    d.line([3,18,5,22], fill=OUTL); d.line([28,18,30,22], fill=OUTL)  # pernas
    return im

def bench_side_sprite():
    # sofa/banco de espera visto DE LADO (perfil): encosto na ESQUERDA (encostado na
    # parede), assento voltado p/ a DIREITA. Espelhar (flip) p/ a parede do outro lado.
    im = newimg(T, 26); d = ImageDraw.Draw(im)
    frame = C('44505e'); cush = C('6ab0c9'); cush_hi = C('92cfe2'); cush_d = C('4f93ad')
    back = C('5a9ec4'); back_hi = C('7fbcdd'); steel = C('8a96a2')
    d.ellipse([5,22,29,25], fill=SHADOW)
    # encosto alto encostado na parede (esquerda)
    rrect(d, [6,3,12,20], back, OUTL)
    d.rectangle([7,4,10,18], fill=back_hi)              # brilho vertical do encosto
    # assento (almofadas) voltado p/ a direita
    rrect(d, [10,12,28,19], cush, OUTL)
    d.rectangle([11,12,27,13], fill=cush_hi)            # brilho do assento
    d.line([18,13,18,18], fill=cush_d)                  # divisao entre almofadas
    d.line([10,19,28,19], fill=cush_d)
    # apoio de braco frontal (direita)
    rrect(d, [26,8,29,19], frame, OUTL)
    # pernas metalicas
    d.rectangle([9,19,11,24], fill=steel); d.rectangle([25,19,27,24], fill=steel)
    return im

def trash_sprite():
    # lixeira clinica 32x24
    im = newimg(T, 24); d = ImageDraw.Draw(im)
    d.ellipse([9,20,23,23], fill=SHADOW)
    rrect(d, [11,7,21,21], C('d7dde3'), OUTL)
    rrect(d, [10,5,22,8], C('eef1f4'), OUTL)           # tampa
    d.line([16,4,16,6], fill=METAL_D)
    d.rectangle([14,11,18,17], fill=C('46b56a'))       # simbolo
    return im

def wheelchair_sprite():
    # cadeira de rodas 32x40 (3/4) — vida de hospital
    H = 40; im = newimg(T, H); d = ImageDraw.Draw(im)
    d.ellipse([5, H-4, 27, H-1], fill=SHADOW)
    frame = C('4a5360'); seat = C('3a6ea5'); seat_l = C('5a86bd'); wheel = C('2b2f38'); rim = C('9aa6b2')
    d.ellipse([2, 18, 14, H-3], fill=wheel, outline=OUTL); d.ellipse([5, 21, 11, H-6], outline=rim)   # roda esq
    d.ellipse([18, 18, 30, H-3], fill=wheel, outline=OUTL); d.ellipse([21, 21, 27, H-6], outline=rim)  # roda dir
    d.rounded_rectangle([8, 6, 24, 18], radius=2, fill=seat, outline=OUTL)      # encosto
    d.rectangle([9, 7, 23, 9], fill=seat_l)                                     # brilho encosto
    d.rounded_rectangle([8, 18, 24, 26], radius=2, fill=seat, outline=OUTL)     # assento
    d.rectangle([7, 16, 9, 21], fill=frame); d.rectangle([23, 16, 25, 21], fill=frame)  # apoios de braco
    d.rectangle([12, H-6, 20, H-3], fill=frame, outline=OUTL)                   # apoio de pes
    return im

def vending_sprite():
    # maquina de vendas 32x44 (recepcao)
    im = newimg(T, 44); d = ImageDraw.Draw(im)
    d.ellipse([5,39,27,43], fill=SHADOW)
    rrect(d, [4,2,28,41], C('5f9c97'), OUTL)            # corpo (teal clínico, harmoniza c/ a paleta)
    rrect(d, [5,3,28,8], C('7ab4af'))                   # topo claro
    rrect(d, [6,9,21,34], C('2b3340'), OUTL)            # vitrine
    for gy in range(11,33,7):                           # itens nas prateleiras
        for gx in range(8,21,5):
            d.rectangle([gx,gy,gx+3,gy+4], fill=C('ffd54a') if (gx+gy)%2 else C('5fe0ea'))
        d.line([6,gy+5,20,gy+5], fill=C('1c232c'))
    rrect(d, [23,9,26,22], C('1f2730'))                 # painel de botoes
    d.rectangle([24,11,25,13], fill=C('5fe0ea')); d.rectangle([24,15,25,17], fill=C('ffd54a'))
    d.rectangle([23,26,27,32], fill=C('cfd6df'), outline=OUTL)  # saida
    return im

def examtable_sprite():
    # maca de exame OBLIQUA: colchao (topo) + face frontal + pernas
    im = newimg(T, 40); d = ImageDraw.Draw(im)
    d.ellipse([4,35,28,39], fill=SHADOW)
    rrect(d, [6,31,9,38], METAL_D, OUTL); rrect(d, [23,31,26,38], METAL_D, OUTL)  # pernas
    rrect(d, [4,10,28,23], C('5aa9c9'), OUTL)           # colchao (topo)
    rrect(d, [5,11,27,14], C('7cc3dd'))                 # brilho
    rrect(d, [4,23,28,32], C('cfe3ea'), OUTL)           # face frontal (estrutura)
    d.line([4,27,28,27], fill=C('b4c8cf'))
    rrect(d, [4,7,13,11], C('f3f6fa'), OUTL)            # rolo de papel
    return im

def skeleton_sprite():
    # modelo anatomico 32x40 em suporte (sala de exames)
    im = newimg(T, 40); d = ImageDraw.Draw(im)
    d.ellipse([10,36,22,39], fill=SHADOW)
    d.line([16,21,16,37], fill=METAL_D); d.line([17,21,17,37], fill=METAL)  # haste
    d.ellipse([12,33,20,38], fill=METAL_D, outline=OUTL)# base
    d.ellipse([12,4,20,13], fill=C('eef1f4'), outline=OUTL)  # cranio
    d.rectangle([14,9,15,10], fill=OUTL); d.rectangle([17,9,18,10], fill=OUTL)  # olhos
    d.line([14,12,18,12], fill=C('b6bfc8'))             # dentes
    d.line([16,13,16,30], fill=C('dfe4e9'))             # coluna
    for ry in range(15,27,3):                           # costelas
        d.arc([12,ry-2,20,ry+4], 200, 340, fill=C('cfd6df'))
    d.line([13,30,11,35], fill=C('dfe4e9')); d.line([19,30,21,35], fill=C('dfe4e9'))  # pernas
    return im

def sign_sprite():
    # placa CUIDADO PISO MOLHADO — cavalete amarelo (A-frame) limpo e legível 32x30
    H = 30; im = newimg(T, H); d = ImageDraw.Draw(im)
    yel = C('f7c83a'); yel_d = C('cf9a16'); yel_l = C('ffe487'); blk = OUTL
    d.ellipse([5, H-3, 27, H], fill=SHADOW)                              # sombra no chao
    # painel traseiro (mais escuro, dá volume de cavalete aberto)
    d.polygon([(10,4),(14,4),(8,H-3),(2,H-3)], fill=yel_d, outline=blk)
    # painel frontal (claro) — trapézio levemente inclinado
    d.polygon([(15,4),(22,4),(29,H-3),(18,H-3)], fill=yel, outline=blk)
    d.line([(15,4),(15,H-3)], fill=yel_d)                                # charneira central
    d.line([(21,5),(28,H-4)], fill=yel_l)                                # brilho na aresta
    # "!" de alerta grande e centralizado no painel frontal
    d.polygon([(21,9),(24,9),(23,19),(22,19)], fill=blk)                 # haste do "!"
    d.rectangle([22,22,24,24], fill=blk)                                 # ponto do "!"
    d.line([(4,H-3),(28,H-3)], fill=C('3a3f47'))                         # travessa/base
    return im

def wallmonitor_sprite():
    # painel/monitor de parede 32x16 (info azul) — vai na parede de fundo
    im = newimg(T, 16); d = ImageDraw.Draw(im)
    rrect(d, [4,1,27,14], C('27313f'), OUTL)
    rrect(d, [6,3,25,12], C('3f6fa3'))
    d.line([8,5,19,5], fill=C('cfe6ff')); d.line([8,8,22,8], fill=C('9fc8ee')); d.line([8,10,16,10], fill=C('7fb0d0'))
    return im

def elevator_sprite():
    # elevador (parede de fundo) 32x46 — duas portas metalicas
    H = 46; im = newimg(T, H); d = ImageDraw.Draw(im)
    rrect(d, [3,2,28,H-1], C('aab4be'), OUTL)          # moldura
    rrect(d, [5,8,26,H-3], C('c8d0d8'))                # vao
    rrect(d, [6,9,15,H-4], C('9aa6b2'), OUTL)          # porta esq
    rrect(d, [16,9,25,H-4], C('9aa6b2'), OUTL)         # porta dir
    d.line([15,9,15,H-4], fill=C('6f7a86')); d.line([16,9,16,H-4], fill=C('e6eaef'))  # vinco
    d.line([9,11,9,H-6], fill=C('b9c2cc')); d.line([22,11,22,H-6], fill=C('b9c2cc'))  # reflexos
    rrect(d, [11,3,20,7], C('1f2730'), OUTL)           # display de andar
    d.rectangle([13,4,14,6], fill=C('ffb300')); d.rectangle([16,4,18,6], fill=C('ffb300'))
    d.ellipse([26,21,28,24], fill=C('ffd54a'), outline=OUTL)  # botao
    return im

def stairs_sprite():
    # escada (parede de fundo) 32x46 — degraus em perspectiva subindo
    H = 46; im = newimg(T, H); d = ImageDraw.Draw(im)
    rrect(d, [2,2,29,H-1], C('c8d0d8'), OUTL)
    for i in range(7):
        y = 5 + i*5; ins = i
        rrect(d, [4+ins, y, 27-ins, y+4], C('dfe4e9') if i % 2 else C('cdd6df'), OUTL)
        d.line([4+ins, y, 27-ins, y], fill=C('eef1f4'))
    d.line([3,4,3,H-2], fill=C('8a94a0')); d.line([28,4,28,H-2], fill=C('8a94a0'))  # corrimao
    return im

def extinguisher_sprite():
    # extintor de parede 32x24 (vermelho)
    im = newimg(T, 24); d = ImageDraw.Draw(im)
    rrect(d, [12,5,19,21], C('d23b46'), OUTL)          # cilindro
    rrect(d, [13,6,15,20], C('e85d66'))                # brilho
    rrect(d, [14,1,17,5], C('2b2f38'))                 # valvula
    d.line([17,3,21,7], fill=C('1f2730'))              # mangueira
    rrect(d, [13,10,18,14], C('ffffff'))               # etiqueta
    return im

chair_sprite().save(f"{OUT}/chair.png")
cabinet_sprite().save(f"{OUT}/cabinet.png")
cooler_sprite().save(f"{OUT}/cooler.png")
rug_sprite().save(f"{OUT}/rug.png")
screen_sprite().save(f"{OUT}/screen.png")
poster_sprite().save(f"{OUT}/poster.png")
clock_sprite().save(f"{OUT}/clock.png")
ivstand_sprite().save(f"{OUT}/ivstand.png")
cart_sprite().save(f"{OUT}/cart.png")
sidetable_sprite().save(f"{OUT}/sidetable.png")
curtain_sprite().save(f"{OUT}/curtain.png")
locker_sprite().save(f"{OUT}/locker.png")
cabinet_side_sprite().save(f"{OUT}/cabinet_side.png")
locker_side_sprite().save(f"{OUT}/locker_side.png")
bench_sprite().save(f"{OUT}/bench.png")
bench_side_sprite().save(f"{OUT}/bench_side.png")
trash_sprite().save(f"{OUT}/trash.png")
vending_sprite().save(f"{OUT}/vending.png")
wheelchair_sprite().save(f"{OUT}/wheelchair.png")
examtable_sprite().save(f"{OUT}/examtable.png")
skeleton_sprite().save(f"{OUT}/skeleton.png")
sign_sprite().save(f"{OUT}/sign.png")
wallmonitor_sprite().save(f"{OUT}/wallmonitor.png")
elevator_sprite().save(f"{OUT}/elevator.png")
stairs_sprite().save(f"{OUT}/stairs.png")
extinguisher_sprite().save(f"{OUT}/extinguisher.png")

# ---------- PERSONAGEM (4 direções x 4 frames) ----------
def _mul(c, f):
    return (int(c[0]*f), int(c[1]*f), int(c[2]*f), c[3])

def _head(d, direction, hair, hair_lt, hair_d, long_hair, skin, glasses, mustache, hy0):
    """Desenha cabeca+cabelo arredondados (chibi limpo, estilo LimeZu)."""
    OL = OUTL; x0, x1 = 10, 21; y1 = hy0 + 11
    skin_d = _mul(skin, 0.90)
    d.rectangle([14, y1-1, 17, y1], fill=skin_d)                 # pescoco
    d.rounded_rectangle([x0, hy0, x1, y1], radius=4, fill=skin, outline=OL)  # cabeca
    d.line([x1-1, hy0+4, x1-1, y1-2], fill=skin_d)               # sombra lado
    if direction == 'down':
        d.rounded_rectangle([x0-1, hy0-1, x1+1, hy0+4], radius=3, fill=hair, outline=OL)  # franja
        d.rectangle([x0-1, hy0+3, x0+1, y1-2], fill=hair)        # costeleta esq
        d.rectangle([x1-1, hy0+3, x1+1, y1-2], fill=hair)        # costeleta dir
        d.line([x0+3, hy0+1, x1-3, hy0+1], fill=hair_lt)         # brilho
        if long_hair:
            d.rounded_rectangle([x0-2, hy0+3, x0+1, y1+5], radius=2, fill=hair, outline=OL)
            d.rounded_rectangle([x1-1, hy0+3, x1+2, y1+5], radius=2, fill=hair, outline=OL)
            d.line([x1, hy0+5, x1, y1+3], fill=hair_lt)          # mecha luz
        ey = hy0 + 6
        EYEW = C('f5f7fb'); PUP = C('3a3340')
        d.line([12, ey-2, 14, ey-2], fill=hair_d)                # sobrancelhas
        d.line([17, ey-2, 19, ey-2], fill=hair_d)
        d.rectangle([12, ey, 13, ey+1], fill=EYEW)               # esclera esq
        d.rectangle([18, ey, 19, ey+1], fill=EYEW)               # esclera dir
        d.point((13, ey+1), fill=PUP); d.point((18, ey+1), fill=PUP)   # pupilas (menores)
        d.point((12, ey), fill=C('ffffff')); d.point((18, ey), fill=C('ffffff'))  # brilho
        d.point((12, ey+2), fill=C('f3a6b6'))                    # bochechas
        d.point((19, ey+2), fill=C('f3a6b6'))
        d.line([15, ey+3, 16, ey+3], fill=skin_d)                # boca
        if glasses:
            d.rectangle([12, ey-1, 14, ey+1], outline=OL)
            d.rectangle([17, ey-1, 19, ey+1], outline=OL)
            d.line([14, ey, 17, ey], fill=OL)
        if mustache:
            d.line([13, ey+2, 18, ey+2], fill=hair_d)
    elif direction == 'up':
        d.rounded_rectangle([x0-1, hy0-1, x1+1, y1-1], radius=4, fill=hair, outline=OL)
        if long_hair:
            d.rounded_rectangle([x0-2, hy0+3, x0+2, y1+6], radius=2, fill=hair, outline=OL)
            d.rounded_rectangle([x1-2, hy0+3, x1+2, y1+6], radius=2, fill=hair, outline=OL)
        d.line([13, hy0+2, 13, y1-3], fill=hair_lt)
        d.line([18, hy0+2, 18, y1-3], fill=hair_lt)
    elif direction == 'left':
        d.rounded_rectangle([x0-1, hy0-1, x1+1, hy0+4], radius=3, fill=hair, outline=OL)
        d.rectangle([x1-2, hy0+2, x1+1, y1-2], fill=hair)
        if long_hair: d.rounded_rectangle([x1-1, hy0+3, x1+2, y1+4], radius=2, fill=hair, outline=OL)
        d.rectangle([11, hy0+6, 13, hy0+7], fill=C('f5f7fb'))    # esclera (perfil)
        d.point((12, hy0+7), fill=C('3a3340'))                   # pupila
        d.rectangle([x0-1, hy0+6, x0, hy0+8], fill=skin)         # nariz
        d.line([12, hy0+9, 14, hy0+9], fill=skin_d)              # boca
    elif direction == 'right':
        d.rounded_rectangle([x0-1, hy0-1, x1+1, hy0+4], radius=3, fill=hair, outline=OL)
        d.rectangle([x0-1, hy0+2, x0+2, y1-2], fill=hair)
        if long_hair: d.rounded_rectangle([x0-2, hy0+3, x0+1, y1+4], radius=2, fill=hair, outline=OL)
        d.rectangle([18, hy0+6, 20, hy0+7], fill=C('f5f7fb'))    # esclera (perfil)
        d.point((19, hy0+7), fill=C('3a3340'))                   # pupila
        d.rectangle([x1, hy0+6, x1+1, hy0+8], fill=skin)
        d.line([17, hy0+9, 19, hy0+9], fill=skin_d)

def char_frame(direction, frame, coat=WHITE, hair=HAIR, hair_lt=HAIRLT, long_hair=True, skin=SKIN,
               hair_d=HAIR_D, glasses=False, mustache=False):
    im = newimg(); d = ImageDraw.Draw(im)
    OL = OUTL; cx = 16
    d.ellipse([9, 28, 23, 31], fill=SHADOW)                      # sombra no chao
    step = [0, 1, 0, -1][frame]                                  # passo
    bob  = [0, -1, 0, -1][frame]                                 # leve sobe-desce
    coat_d = _mul(coat, 0.90); coat_dd = _mul(coat, 0.82)
    shoe = _mul(NAVY, 1.35)
    # ---- PERNAS ----
    d.rectangle([cx-4, 25+bob, cx-1, 29+step], fill=NAVY)        # esq
    d.rectangle([cx+1, 25+bob, cx+4, 29-step], fill=NAVY)        # dir
    d.point((cx-4, 25+bob), fill=shoe); d.point((cx+1, 25+bob), fill=shoe)  # brilho calca
    d.rounded_rectangle([cx-5, 29+step, cx-1, 31+step], radius=1, fill=OL)  # sapato esq
    d.rounded_rectangle([cx+1, 29-step, cx+5, 31-step], radius=1, fill=OL)  # sapato dir
    d.point((cx-5, 29+step), fill=shoe); d.point((cx+5, 29-step), fill=shoe)
    # ---- TRONCO / JALECO ----
    bt = 15 + bob
    d.rounded_rectangle([cx-6, bt+1, cx-4, bt+8], radius=1, fill=coat, outline=OL)  # braco esq
    d.rounded_rectangle([cx+4, bt+1, cx+6, bt+8], radius=1, fill=coat, outline=OL)  # braco dir
    d.line([cx+5, bt+2, cx+5, bt+7], fill=coat_d)               # sombra braco dir
    d.rounded_rectangle([cx-5, bt, cx+5, bt+11], radius=3, fill=coat, outline=OL)   # tronco/jaleco
    d.rectangle([cx-4, bt+1, cx+4, bt+2], fill=COATSH)           # luz no ombro
    d.line([cx-4, bt+3, cx-4, bt+9], fill=COATSH)               # brilho lateral esq (volume)
    d.line([cx+3, bt+3, cx+3, bt+10], fill=coat_d)              # sombra lateral dir
    if direction == 'down':                                      # lapela do jaleco (abertura em V)
        d.line([cx-1, bt+1, cx-3, bt+7], fill=coat_d)
        d.line([cx+1, bt+1, cx+3, bt+7], fill=coat_d)
        d.point((cx-3, bt+5), fill=C('c2cad2')); d.point((cx+3, bt+8), fill=C('c2cad2'))  # botoes
        d.rectangle([cx+1, bt+7, cx+3, bt+9], fill=coat_d)        # bolso no peito
        d.line([cx+2, bt+6, cx+2, bt+8], fill=C('d05a8a'))       # caneta no bolso
    elif direction == 'up':                                      # costas: gola + costura central
        d.line([cx-3, bt+1, cx+3, bt+1], fill=coat_dd)          # gola/ombros
        d.line([cx, bt+2, cx, bt+10], fill=coat_d)              # costura das costas
        d.point((cx-2, bt+3), fill=COATSH)
    if direction != 'up':                                        # estetoscopio (de frente/lado)
        d.line([cx-3, bt+1, cx-1, bt+6], fill=TEAL_D); d.line([cx+3, bt+1, cx+1, bt+6], fill=TEAL_D)
        d.line([cx-3, bt+1, cx-1, bt+6], fill=TEAL); d.point((cx-2, bt+3), fill=TEAL)  # brilho tubo
        d.ellipse([cx-1, bt+6, cx+1, bt+8], outline=TEAL_D)
        d.point((cx-3, bt+9), fill=C('c2cad2'))                  # botao
    # ---- CABECA ----
    _head(d, direction, hair, hair_lt, hair_d, long_hair, skin, glasses, mustache, 3 + bob)
    return im

DIRS = ['down','left','right','up']
def char_sheet(**kw):
    sh = Image.new('RGBA', (T*4, T*4), (0,0,0,0))
    for r, dr in enumerate(DIRS):
        for c in range(4):
            sh.paste(char_frame(dr, c, **kw), (c*T, r*T))
    return sh
sheet = char_sheet()
sheet.save(f"{OUT}/ana.png")
# sheets de caminhada (4 direções) para os NPCs que andam
char_sheet(coat=C('d9b3ff'), hair=C('6a4a8a'), hair_lt=C('8a68aa'), hair_d=C('4a3168'), long_hair=True).save(f"{OUT}/camila.png")
char_sheet(coat=C('a8e6cf'), hair=C('2a1d16'), hair_lt=C('45301f'), hair_d=C('170f08'), long_hair=False).save(f"{OUT}/thiago.png")

# NPCs (frente, parados) — distintos por cabelo/óculos/bigode
def npc(coat, hair, hair_d, skin=SKIN, hair_lt=None, long_hair=False, glasses=False, mustache=False):
    if hair_lt is None: hair_lt = _mul(hair, 1.25)
    return char_frame('down', 0, coat=coat, hair=hair, hair_lt=hair_lt, long_hair=long_hair,
                      skin=skin, hair_d=hair_d, glasses=glasses, mustache=mustache)
npc(C('eef1f4'), C('9a9a9a'), C('6a6a6a'), skin=C('e0ac80'), mustache=True).save(f"{OUT}/npc_roberto.png")   # médico grisalho
npc(C('bfe7ee'), C('5a4030'), C('43301f'), long_hair=True).save(f"{OUT}/npc_clara.png")                      # enfermeira
npc(C('fff3c0'), C('242424'), C('111111'), skin=C('d79a6b'), glasses=True).save(f"{OUT}/npc_lucas.png")      # farmacêutico
npc(C('d9b3ff'), C('6a4a8a'), C('4a3168'), long_hair=True).save(f"{OUT}/npc_camila.png")
npc(C('a8e6cf'), C('2a1d16'), C('170f08')).save(f"{OUT}/npc_thiago.png")

# ---------- CONTACT SHEET (4x) para conferência ----------
items = ['floor','floor_rose','floor_blue','wall','wall_base','wall_v','wall_h','wall_window','plant','desk','bed',
         'ivstand','cart','sidetable','curtain','locker','bench','bench_side','trash',
         'vending','examtable','skeleton','sign','wallmonitor','elevator','stairs','extinguisher','chair','cabinet','cabinet_side','locker_side','cooler','screen','rug',
         'npc_roberto','npc_clara','npc_lucas']
cs = Image.new('RGBA', (T*4*6, T*4*6), C('334155'))
for i,name in enumerate(items):
    im = Image.open(f"{OUT}/{name}.png")
    im = im.resize((im.width*4, im.height*4), Image.NEAREST)
    cs.paste(im, ((i%6)*T*4, (i//6)*T*4), im)
# Ana sheet ampliada embaixo
ana4 = sheet.resize((T*4*4, T*4*4), Image.NEAREST)
cs2 = Image.new('RGBA', (max(cs.width, ana4.width), cs.height + ana4.height + 8), C('334155'))
cs2.paste(cs, (0,0)); cs2.paste(ana4, (0, cs.height+8), ana4)
cs2.convert('RGB').save(f"{OUT}/_contact.png")
print("OK -> arquivos em", OUT)
