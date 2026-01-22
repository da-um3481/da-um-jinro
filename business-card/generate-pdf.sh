#!/bin/bash

# 다움진로진학컨설팅 정라미 명함 - PDF 생성 스크립트
# 사용법: ./generate-pdf.sh

echo "🎨 다움진로진학컨설팅 정라미 명함 PDF 생성 시작..."

# 필요한 도구 확인
if ! command -v wkhtmltopdf &> /dev/null; then
    echo "⚠️  wkhtmltopdf가 설치되어 있지 않습니다."
    echo "📦 설치 방법:"
    echo "   - Ubuntu/Debian: sudo apt-get install wkhtmltopdf"
    echo "   - macOS: brew install wkhtmltopdf"
    echo "   - Windows: https://wkhtmltopdf.org/downloads.html"
    echo ""
    echo "💡 대안: 브라우저에서 index.html을 열고 Ctrl+P → PDF로 저장"
    exit 1
fi

# PDF 생성
echo "📄 index.html → business-card.pdf 변환 중..."
wkhtmltopdf \
    --page-width 90mm \
    --page-height 50mm \
    --margin-top 0 \
    --margin-bottom 0 \
    --margin-left 0 \
    --margin-right 0 \
    --dpi 300 \
    --enable-local-file-access \
    index.html \
    다움진로진학컨설팅_정라미_명함.pdf

if [ $? -eq 0 ]; then
    echo "✅ PDF 생성 완료: 다움진로진학컨설팅_정라미_명함.pdf"
    echo "📏 크기: 90mm x 50mm (표준 명함 사이즈)"
    echo "🖨️  인쇄소에 전달 가능"
else
    echo "❌ PDF 생성 실패"
    echo "💡 대안: 브라우저에서 수동으로 PDF 저장"
    exit 1
fi

echo ""
echo "🎉 명함 제작 완료!"
echo "📁 생성된 파일:"
ls -lh *.pdf 2>/dev/null || echo "   (PDF 파일 없음)"
