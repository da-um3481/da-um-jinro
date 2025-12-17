#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
근화여자중학교 학생 신청용 포스터 생성
"""

def create_poster():
    """신청용 포스터 HTML 생성 (9:16 세로)"""
    
    html_content = """<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>근화여중 겨울방학 프로그램 신청</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
            background: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }
        
        .poster {
            width: 540px;
            height: 960px;
            background: linear-gradient(135deg, #7B1FA2 0%, #9C27B0 100%);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            position: relative;
        }
        
        .header {
            background: white;
            padding: 40px 30px 30px;
            text-align: center;
            position: relative;
        }
        
        .school-logo {
            font-size: 48px;
            margin-bottom: 15px;
        }
        
        .school-name {
            font-size: 32px;
            font-weight: bold;
            color: #7B1FA2;
            margin-bottom: 10px;
        }
        
        .program-title {
            font-size: 22px;
            color: #666;
            font-weight: bold;
            line-height: 1.4;
        }
        
        .characters {
            background: white;
            padding: 20px;
            text-align: center;
        }
        
        .characters img {
            width: 100%;
            max-width: 400px;
            height: auto;
        }
        
        .content {
            padding: 40px 30px;
            color: white;
        }
        
        .badge {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border-radius: 50px;
            padding: 12px 25px;
            display: inline-block;
            margin-bottom: 25px;
            font-size: 18px;
            font-weight: bold;
        }
        
        .main-text {
            font-size: 38px;
            font-weight: bold;
            line-height: 1.3;
            margin-bottom: 30px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        
        .info-box {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 20px;
            color: #333;
        }
        
        .info-box h3 {
            color: #7B1FA2;
            font-size: 20px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .info-item {
            padding: 8px 0;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .info-item .icon {
            font-size: 20px;
        }
        
        .highlight-box {
            background: #FFF59D;
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 20px;
            color: #333;
            text-align: center;
        }
        
        .highlight-box .big-text {
            font-size: 28px;
            font-weight: bold;
            color: #E65100;
            margin-bottom: 15px;
        }
        
        .highlight-box p {
            font-size: 18px;
            font-weight: bold;
            color: #424242;
            line-height: 1.6;
        }
        
        .apply-box {
            background: white;
            border-radius: 15px;
            padding: 25px;
            text-align: center;
            color: #333;
        }
        
        .apply-box h3 {
            color: #E91E63;
            font-size: 24px;
            margin-bottom: 15px;
        }
        
        .apply-box p {
            font-size: 18px;
            font-weight: bold;
            color: #7B1FA2;
            line-height: 1.8;
        }
        
        .footer {
            background: rgba(0, 0, 0, 0.3);
            padding: 20px;
            text-align: center;
            color: white;
            font-size: 14px;
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .poster {
                box-shadow: none;
            }
        }
        
        @media (max-width: 600px) {
            .poster {
                width: 100%;
                height: auto;
                min-height: 100vh;
            }
        }
    </style>
</head>
<body>
    <div class="poster">
        <div class="header">
            <div class="school-logo">🏫</div>
            <div class="school-name">경주 근화여자중학교</div>
            <div class="program-title">1,2학년 겨울방학<br>자기주도학습 프로그램</div>
        </div>
        
        <div class="characters">
            <img src="https://www.genspark.ai/api/files/s/GIvg5eZK" alt="카카오 프렌즈">
        </div>
        
        <div class="content">
            <div class="badge">❄️ 겨울방학 특별 프로그램</div>
            
            <div class="main-text">
                함께 성장하는<br>
                30일의 변화! ✨
            </div>
            
            <div class="info-box">
                <h3>📚 프로그램 내용</h3>
                <div class="info-item">
                    <span class="icon">✓</span>
                    <span>자기주도학습 습관 완성</span>
                </div>
                <div class="info-item">
                    <span class="icon">✓</span>
                    <span>주요 교과 집중 학습</span>
                </div>
                <div class="info-item">
                    <span class="icon">✓</span>
                    <span>개인별 맞춤 학습 지도</span>
                </div>
                <div class="info-item">
                    <span class="icon">✓</span>
                    <span>진로 탐색 및 목표 설정</span>
                </div>
            </div>
            
            <div class="info-box">
                <h3>⏰ 프로그램 정보</h3>
                <div class="info-item">
                    <span class="icon">📅</span>
                    <span>기간: 겨울방학 30일</span>
                </div>
                <div class="info-item">
                    <span class="icon">👩‍🎓</span>
                    <span>대상: 1학년, 2학년</span>
                </div>
                <div class="info-item">
                    <span class="icon">👩‍🏫</span>
                    <span>방식: 소그룹 맞춤 지도</span>
                </div>
            </div>
            
            <div class="highlight-box">
                <div class="big-text">📝 신청 방법</div>
                <p>
                    담임 선생님 또는<br>
                    진로 선생님께<br>
                    신청해 주세요!
                </p>
            </div>
            
            <div class="apply-box">
                <h3>💝 특별 혜택</h3>
                <p>
                    • 1:1 맞춤 학습 관리<br>
                    • 학습 습관 완성<br>
                    • 성적 향상 보장<br>
                    • 학부모 정기 상담
                </p>
            </div>
        </div>
        
        <div class="footer">
            DA.UM 다움진로진학컨설팅 | 문의: 010-2657-3481 (정라미)
        </div>
    </div>
</body>
</html>
"""
    
    output_file = '/home/user/webapp/근화여중_학생신청_포스터.html'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"✅ 포스터 생성 완료: {output_file}")
    return output_file

if __name__ == "__main__":
    create_poster()
