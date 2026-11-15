import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
// Dữ liệu mẫu sản phẩm (Có phân loại type: Vegetable, Seafood, Drinks)
const PRODUCTS = [
  { id: '1', name: 'Apple Italian Piada', type: 'Vegetable', price: 28.00, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', rating: 5 },
  { id: '2', name: 'Pear American', type: 'Vegetable', price: 15.00, image: 'https://images.unsplash.com/photo-1514733670128-468d41a26fcd?w=400', rating: 5 },
  { id: '3', name: 'Coconut VietNam', type: 'Vegetable', price: 10.00, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400', rating: 5 },
  { id: '4', name: 'Apricot China', type: 'Vegetable', price: 9.00, image: 'https://images.unsplash.com/photo-1595124799059-e9c8bc84df3b?w=400', rating: 5 },
  { id: '5', name: 'Orange Thailand', type: 'Vegetable', price: 8.00, image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400', rating: 5 },
  { id: '6', name: 'Avocado VietNam', type: 'Vegetable', price: 10.00, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400', rating: 5 },
  { id: '7', name: 'Banana Cavendish', type: 'Vegetable', price: 5.00, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', rating: 4 },
  
  { id: '8', name: 'Fresh Salmon Seafood', type: 'Seafood', price: 35.00, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400', rating: 5 },
  { id: '9', name: 'King Prawns', type: 'Seafood', price: 25.00, image: 'https://images.unsplash.com/photo-1565680368481-43b2e4265cb9?w=400', rating: 4 },
  { id: '10', name: 'Fresh Oysters', type: 'Seafood', price: 40.00, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', rating: 5 },

  { id: '11', name: 'Green Cocktail Drink', type: 'Drinks', price: 12.00, image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400', rating: 5 },
  { id: '12', name: 'Orange Juice Fresh', type: 'Drinks', price: 8.00, image: 'https://images.unsplash.com/photo-1621506289938-a88a0377ee6d?w=400', rating: 4 },
  { id: '13', name: 'Martini Classic', type: 'Drinks', price: 15.00, image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400', rating: 5 },
];

const Stack = createNativeStackNavigator();

export default function App() {
  // Quản lý trạng thái giỏ hàng (Array chứa các sản phẩm được chọn)
  const [basket, setBasket] = useState([
    { ...PRODUCTS[0], quantity: 2 },
    { ...PRODUCTS[1], quantity: 1 },
    { ...PRODUCTS[2], quantity: 3 },
    { ...PRODUCTS[3], quantity: 1 },
    { ...PRODUCTS[4], quantity: 1 },
    { ...PRODUCTS[5], quantity: 1 },
  ]);

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToBasket = (product) => {
    setBasket(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Hàm cập nhật số lượng sản phẩm trong giỏ hàng (+ / -)
  const updateQuantity = (id, delta) => {
    setBasket(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Screen01">
        <Stack.Screen name="Screen01" component={Screen01} />
        <Stack.Screen name="Screen02">
          {props => <Screen02 {...props} basket={basket} addToBasket={addToBasket} />}
        </Stack.Screen>
        <Stack.Screen name="Screen03">
          {props => <Screen03 {...props} basket={basket} updateQuantity={updateQuantity} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ==================== CÂU 01: MÀN HÌNH SCREEN 01 ====================
function Screen01({ navigation }) {
  return (
    <SafeAreaView style={styles.container1}>
      <View style={styles.content1}>
        <Text style={styles.title1}>Order your favorite!</Text>
        
        <View style={styles.imageContainer1}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500' }} 
            style={styles.mainImage1} 
          />
        </View>

        {/* Nút Get Started chuyển sang Screen_02 */}
        <TouchableOpacity 
          style={styles.button1} 
          onPress={() => navigation.navigate('Screen02')}
        >
          <Text style={styles.buttonText1}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ==================== CÂU 02: MÀN HÌNH SCREEN 02 ====================
function Screen02({ navigation, basket, addToBasket }) {
  const [selectedType, setSelectedType] = useState('Vegetable'); // Mặc định là Vegetable
  const [showAll, setShowAll] = useState(false);                 // Ban đầu không hiển thị tất cả (chỉ 6 bản ghi)
  const [search, setSearch] = useState('');

  // Lọc sản phẩm theo type và từ khóa search
  const filteredProducts = PRODUCTS.filter(p => p.type === selectedType && p.name.toLowerCase().includes(search.toLowerCase()));
  
  // Nếu chưa nhấn See all thì chỉ lấy tối đa 6 bản ghi đầu tiên
  const displayedProducts = showAll ? filteredProducts : filteredProducts.slice(0, 6);

  return (
    <SafeAreaView style={styles.container2}>
      {/* Header Bar */}
      <View style={styles.header2}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        {/* Nhấn vào biểu tượng giỏ hàng chuyển sang Screen_03 */}
        <TouchableOpacity onPress={() => navigation.navigate('Screen03')} style={styles.cartIconContainer}>
          <Ionicons name="cart-outline" size={26} color="green" />
          {basket.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{basket.reduce((sum, i) => sum + i.quantity, 0)}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
        <TextInput 
          placeholder="Search" 
          value={search} 
          onChangeText={setSearch} 
          style={styles.searchInput}
        />
      </View>

      {/* Các nút phân loại: Vegetable, Seafood, Drinks */}
      <View style={styles.categoryContainer}>
        {['Vegetable', 'Seafood', 'Drinks'].map(type => (
          <TouchableOpacity 
            key={type} 
            style={[styles.categoryBtn, selectedType === type && styles.categoryBtnActive]}
            onPress={() => { setSelectedType(type); setShowAll(false); }}
          >
            <Text style={[styles.categoryText, selectedType === type && styles.categoryTextActive]}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tiêu đề & nút See all */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Order your favorite!</Text>
        <TouchableOpacity onPress={() => setShowAll(!showAll)}>
          <Text style={styles.seeAllText}>{showAll ? 'Show less' : 'See all'}</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách sản phẩm */}
      <ScrollView contentContainerStyle={styles.productList}>
        {displayedProducts.map(item => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.productCard}
            onPress={() => {
              addToBasket(item);
              navigation.navigate('Screen03'); // Nhấn vào item thêm vào giỏ và chuyển sang Screen_03
            }}
          >
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <View style={styles.productFooter}>
              <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
              <TouchableOpacity onPress={(e) => {
                e.stopPropagation();
                addToBasket(item);
              }}>
                <Ionicons name="add-circle" size={24} color="green" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ==================== CÂU 03: MÀN HÌNH SCREEN 03 ====================
function Screen03({ navigation, basket, updateQuantity }) {
  // Hàm tính tổng tiền (Total)
  const total = basket.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <SafeAreaView style={styles.container3}>
      {/* Header */}
      <View style={styles.header3}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle3}>My Basket</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Render danh sách giỏ hàng */}
      <ScrollView contentContainerStyle={styles.basketList}>
        {basket.map(item => (
          <View key={item.id} style={styles.basketItem}>
            <Image source={{ uri: item.image }} style={styles.basketImage} />
            <View style={styles.basketInfo}>
              <Text style={styles.basketName}>{item.name}</Text>
              <Text style={styles.basketPrice}>${item.price.toFixed(2)}</Text>
              <View style={styles.ratingContainer}>
                {[...Array(item.rating)].map((_, i) => (
                  <FontAwesome key={i} name="star" size={12} color="#f1c40f" />
                ))}
              </View>
            </View>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
                <Ionicons name="remove-circle-outline" size={24} color="green" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                <Ionicons name="add-circle" size={24} color="green" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer chứa Tổng tiền và nút Payment */}
      <View style={styles.footer3}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.paymentBtn} onPress={() => alert('Payment Successful!')}>
          <Text style={styles.paymentText}>Payment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ==================== STYLES ====================
const styles = StyleSheet.create({
  // Style Screen 01
  container1: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  content1: { alignItems: 'center', padding: 20, width: '100%' },
  title1: { fontSize: 26, fontWeight: 'bold', color: '#27ae60', marginBottom: 40, textAlign: 'center' },
  imageContainer1: { marginBottom: 50, alignItems: 'center' },
  mainImage1: { width: 280, height: 280, resizeMode: 'contain', borderRadius: 20 },
  button1: { backgroundColor: '#27ae60', paddingVertical: 15, paddingHorizontal: 60, borderRadius: 30, width: '80%', alignItems: 'center' },
  buttonText1: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  // Style Screen 02
  container2: { flex: 1, backgroundColor: '#f8f9fa', paddingHorizontal: 16, paddingTop: 10 },
  header2: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  cartIconContainer: { position: 'relative' },
  badge: { position: 'absolute', right: -6, top: -6, backgroundColor: 'red', borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, height: 45, marginBottom: 15 },
  searchInput: { flex: 1, fontSize: 16 },
  categoryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  categoryBtn: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fff' },
  categoryBtnActive: { backgroundColor: '#2ecc71', borderColor: '#2ecc71' },
  categoryText: { color: '#555', fontWeight: '500' },
  categoryTextActive: { color: '#fff' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#27ae60' },
  seeAllText: { color: '#e67e22', fontWeight: 'bold' },
  productList: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: 20 },
  productCard: { width: '48%', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 15, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  productImage: { width: 100, height: 100, resizeMode: 'contain', marginBottom: 10 },
  productName: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: '#333' },
  productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  productPrice: { fontSize: 14, fontWeight: 'bold', color: '#27ae60' },

  // Style Screen 03
  container3: { flex: 1, backgroundColor: '#f8f9fa', paddingHorizontal: 16, paddingTop: 10 },
  header3: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle3: { fontSize: 18, fontWeight: 'bold', color: '#27ae60' },
  basketList: { paddingBottom: 20 },
  basketItem: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 10, marginBottom: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  basketImage: { width: 60, height: 60, resizeMode: 'contain', marginRight: 12 },
  basketInfo: { flex: 1 },
  basketName: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  basketPrice: { fontSize: 14, color: '#27ae60', fontWeight: 'bold', marginBottom: 4 },
  ratingContainer: { flexDirection: 'row' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center' },
  quantityText: { marginHorizontal: 8, fontSize: 16, fontWeight: 'bold' },
  footer3: { backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 20, borderTopRightRadius: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#8e44ad' },
  paymentBtn: { backgroundColor: '#2ecc71', paddingVertical: 15, borderRadius: 25, alignItems: 'center' },
  paymentText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});