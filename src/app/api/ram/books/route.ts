import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/ram/books
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const warehouseType = url.searchParams.get('warehouseType') as 'NORMAL' | 'VEC';
    const category = url.searchParams.get('category');
    const language = url.searchParams.get('language');
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const searchQuery = url.searchParams.get('search');

    let where: any = {};
    
    if (warehouseType) {
      where.warehouseType = warehouseType;
    }
    
    if (category) {
      where.category = category;
    }
    
    if (language) {
      where.language = language;
    }
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    
    if (searchQuery) {
      where.name = { contains: searchQuery, mode: 'insensitive' };
    }

    const books = await prisma.book_Z.findMany({
      where,
      include: {
        inventories: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}

// POST /api/ram/books
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
  const { name, category, languages, language, price, warehouseType, isPriceSameForAll } = body;

    // If price is same for all languages
    if (isPriceSameForAll) {
      const books = await Promise.all(
        (languages || []).map((lang: string) =>
          prisma.book_Z.create({
            data: {
              name,
              category,
              language: lang as any,
              price,
              warehouseType
            }
          })
        )
      );
      return NextResponse.json(books);
    }

    // If different prices for different languages (single language expected)
    const langToUse = language || (Array.isArray(languages) ? languages[0] : undefined);
    if (!langToUse) return NextResponse.json({ error: 'missing_language' }, { status: 400 });

    const book = await prisma.book_Z.create({
      data: {
        name,
        category,
        language: langToUse as any,
        price,
        warehouseType
      }
    });
    return NextResponse.json(book);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
  }
}