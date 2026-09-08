from pathlib import Path
import json,re
from pypdf import PdfReader
import pdfplumber
from PIL import Image, ImageOps, ImageDraw

ROOT=Path(__file__).resolve().parents[1]
pdf=ROOT/'output/pdf/pds-diary-design.pdf'
requirements=json.loads((ROOT/'docs/requirements.json').read_text(encoding='utf-8'))['requirements']
schema=json.loads((ROOT/'contracts/pds-schema-v2.json').read_text(encoding='utf-8'))
reader=PdfReader(pdf)
texts=[p.extract_text() for p in reader.pages]
whole='\n'.join(texts)
expected={f'T06-C{i:02d}' for i in [1,*range(4,37),*range(57,61),*range(78,84)]}
actual={r['id'] for r in requirements}
assert actual==expected
assert len(reader.pages)==20, len(reader.pages)
assert all(i in whole for i in expected)
assert '\ufffd' not in whole
assert '/api/v1/v1' not in whole
assert re.search(r'/api/(plans|tasks|review|reflections|carry-forwards|export)', whole) is None
assert '지금은 로그인이 없어 링크를 아는 사람은 누구나 볼 수 있습니다.' in whole
assert schema['status']=='design' and schema['verified_against_database'] is False
assert len(schema['tables'])==9
assert schema['database']['engine']=='MariaDB'
assert not any(term in json.dumps(schema) for term in ['timestamptz','jsonb','DEFERRABLE','cardinality(','EXTRACT(EPOCH'])
for i,t in enumerate(texts,1):
    assert f'{i:02d} / 20' in t
    assert len(t)>500
matrix_text='\n'.join(texts[11:15])
assert set(re.findall(r'T06-C\d{2}',matrix_text))==expected
normalized=lambda t: re.sub(r'\s+','',t)
assert all(normalized(r['text']) in normalized(matrix_text) for r in requirements)
bounds=[]
with pdfplumber.open(pdf) as doc:
    for i,page in enumerate(doc.pages,1):
        bad=[ch for ch in page.chars if ch['x0']<40 or ch['x1']>page.width-40 or ch['top']<15 or ch['bottom']>page.height-18]
        assert not bad,(i,len(bad))
        body=[ch for ch in page.chars if 46<ch['top']<page.height-50]
        bounds.append({'page':i,'body_bottom':round(max(c['bottom'] for c in body),1)})
links=[a.get_object() for page in reader.pages for a in page.get('/Annots',[]) if a.get_object().get('/Subtype')=='/Link']
assert len(links)==24,len(links)
result={'status':'passed_document_checks','pages':len(reader.pages),'requirements':len(expected),'exact_requirement_texts_present':True,'tables_in_design_contract':9,'database_engine':'MariaDB','official_source_links':len(links),'page_bounds':bounds,'application_implemented':False,'application_tests_run':False}
(ROOT/'tmp/pdfs/document-checks.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
paths=sorted((ROOT/'tmp/pdfs').glob('final-*.png'))
assert len(paths)==20,len(paths)
for index in range(0,20,4):
    sheet=Image.new('RGB',(1160,1680),'#d9e0e6')
    draw=ImageDraw.Draw(sheet)
    for j,p in enumerate(paths[index:index+4]):
        x=(j%2)*580;y=(j//2)*840
        pic=ImageOps.contain(Image.open(p),(550,795))
        sheet.paste(pic,(x+15,y+28));draw.text((x+15,y+8),p.stem,fill='black')
    sheet.save(ROOT/f'tmp/pdfs/review-{index//4+1}.png')
print(json.dumps(result,ensure_ascii=True))
