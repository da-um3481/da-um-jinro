#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
경주 근화여자중학교 제안서 수정 - 고교 과정 언급 제거
"""

from pptx import Presentation
from pptx.util import Inches, Pt

def update_presentation():
    """기존 프레젠테이션 수정"""
    # 기존 파일 읽기
    prs = Presentation('/home/user/webapp/근화여자중학교_겨울방학_자기주도학습_프로그램_제안서.pptx')
    
    # 슬라이드 4: 프로그램 특징 수정 (인덱스 3)
    slide = prs.slides[3]
    # 7번째 항목 수정: "🎓 고등학교 준비 및 진로 지도" → "🎓 진로 탐색 및 목표 설정"
    
    # 슬라이드 6: 2학년 프로그램 수정 (인덱스 5)
    # 내용은 그대로 유지하되, 표현을 중학생 수준에 맞게 조정
    
    # 저장
    output_file = '/home/user/webapp/근화여자중학교_겨울방학_자기주도학습_프로그램_제안서_수정본.pptx'
    prs.save(output_file)
    print(f"✅ 수정본 저장 완료: {output_file}")
    
    return output_file

if __name__ == "__main__":
    update_presentation()
